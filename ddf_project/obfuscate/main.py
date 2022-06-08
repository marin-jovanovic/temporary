import json
import os
import pathlib
import secrets
import subprocess
from os import path


def join_with_curr_path(p):
    curr_path = pathlib.Path(__file__).parent.resolve()
    return path.join(curr_path, p)


def get_config():
    return {
        "correct_image_prefix": "corr_",
        "incorrect_image_prefix": "incorr_",
        "config folder": "config",
        "out test": "out_test",
        "out solution": "out_solution"
    }


def generate_link(payload):
    result = subprocess.run(
        [
            "curl", "-XPOST",
            "--data-urlencode",
            f"url={payload}",
            "https://hideuri.com/api/v1/shorten"

        ], capture_output=True, text=True
    )

    return json.loads(result.stdout)["result_url"]


def load_config_json(file):
    with open(join_with_curr_path(
            path.join(get_config()["config folder"], file))) as f:
        return json.loads(f.read())


def get_incorrect_images():
    return {get_config()["incorrect_image_prefix"] + k: v for k, v in
            load_config_json("incorrect_images.json").items()}


def get_correct_images():
    return {get_config()["correct_image_prefix"] + k: v for k, v in
            load_config_json("correct_images.json").items()}


def get_students():
    return load_config_json("students.json")


def main():
    correct_images = get_correct_images()
    incorrect_images = get_incorrect_images()
    all_images = correct_images | incorrect_images

    num_half = int((len(all_images)) / 2)

    image_enum = {
        k: v for k, v in enumerate(all_images.items())
    }

    student_task = {}
    student_solution = {}

    choice = "".join([str(i) for i in image_enum.keys()])

    for student in get_students():
        chosen_index = set()

        while len(chosen_index) != num_half:
            if (i := int(secrets.choice(choice))) not in chosen_index:
                chosen_index.add(i)

        chosen_images = [image_enum[i] for i in chosen_index]
        chosen_obfuscated = [(i[0], generate_link(i[1])) for i in chosen_images]

        student_task[student] = chosen_obfuscated
        student_solution[student] = [i for i in chosen_obfuscated if
                                     str(i[0]).startswith(
                                         get_config()["correct_image_prefix"])]

    for f in [join_with_curr_path(get_config()["out test"]),
              join_with_curr_path(get_config()["out solution"])]:

        if not path.exists(f):
            os.makedirs(f)

    for i in [(student_task, get_config()["out test"]),
              (student_solution, get_config()["out solution"])]:
        for student, task in i[0].items():
            with open(
                    join_with_curr_path(
                        path.join(
                            i[1],
                            str(student)
                        )
                    ), "w+"

            ) as f:
                for j in task:
                    f.write(j[1])
                    f.write("\n")


if __name__ == '__main__':
    main()
