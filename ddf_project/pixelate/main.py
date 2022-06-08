import csv
import os
import pathlib
import random
from itertools import islice
from string import digits

from PIL import Image, ImageDraw, ImageFont
import cv2


def chunk(it, size):
    it = iter(it)
    return iter(lambda: tuple(islice(it, size)), ())


def join_with_curr_working_dir(p):
    working_dir = pathlib.Path(__file__).parent.resolve()
    return os.path.join(working_dir, p)


def pixelate(source):

    # Input image
    img_input = cv2.imread(source)

    # Get input size
    height, width = img_input.shape[:2]

    # Desired "pixelated" size
    k = 170
    w, h = (k, k)

    # Resize input to "pixelated" size
    temp = cv2.resize(img_input, (w, h), interpolation=cv2.INTER_LINEAR)

    # Initialize output image
    output = cv2.resize(temp, (width, height), interpolation=cv2.INTER_NEAREST)

    cv2.imwrite(source, output)


def main():

    with open(join_with_curr_working_dir("jmbag.txt")) as student_id_f:
        ids = student_id_f.read().split("\n")
        print("id loading completed")

        with open(join_with_curr_working_dir("answers.csv"), "w") as f:
            writer = csv.writer(f)
            writer.writerow(["student_id", "answer"])

        print("csv header writing completed")

        out_dir_path = join_with_curr_working_dir("out")

        if not os.path.isdir(out_dir_path):
            pathlib.Path(out_dir_path).mkdir(parents=True, exist_ok=True)

        for student_id in ids:
            if student_id == "":
                continue

            key_size = 5

            key = "answer" + \
                  "".join(random.choice(digits) for _ in range(key_size))

            with open(join_with_curr_working_dir("answers.csv"), "a") as f:
                writer = csv.writer(f)
                writer.writerow([student_id, key])

            img = Image.new('RGB', (650, 100), color=(255, 255, 255))

            r = "roboto"

            if r == "consolas":
                p = join_with_curr_working_dir(
                    os.path.join("consolas", "CONSOLA.TTF"))

            else:
                p = join_with_curr_working_dir(
                    os.path.join("roboto", "Roboto-Black.ttf"))

            fnt = ImageFont.truetype(p, 25)
            d = ImageDraw.Draw(img)

            for i, v in enumerate(list(chunk(key, 50))):
                v = "   ".join(v)

                d.text((10, (i + 1) * 40), v, font=fnt, fill=(0, 0, 0))

            student_dir_path = join_with_curr_working_dir(
                os.path.join("out", student_id))

            if not os.path.isdir(student_dir_path):
                pathlib.Path(student_dir_path).mkdir(parents=True,
                                                     exist_ok=True)

            img.save(os.path.join(student_dir_path, "key.png"))

            pixelate(os.path.join(student_dir_path, "key.png"))

            print(f"{student_id=} completed")


if __name__ == '__main__':
    main()
