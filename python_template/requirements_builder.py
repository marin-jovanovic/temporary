import subprocess

from src_py.comm.comm_root import get_root_path


def main():
    root = get_root_path()

    build_env_scheme(root)
    build_pip_req(root)


def build_pip_req(src):
    """
    create pip requirements in @destination_file_name

    Args:
        src: root directory

    Returns:
        std errors
    """

    destination_file_name = "requirements.pip.txt"

    with open(src / destination_file_name, "w+") as f:

        result = subprocess.run(
            ["pip3", "freeze"], text=True, stdout=f
        )

    if result.stderr:
        print("stderr:", result.stderr)

    return not result.stderr


def build_env_scheme(src):
    """
    read .env file and copy scheme to @destination_file_name

    check for leaks in @destination_file_name

    todo check for leaks in @root

    Args:
        src: root directory

    Returns: @None

    """

    destination_file_name = "env-scheme.txt"

    with open(src / ".env", "r") as f:
        l = f.read()
        l = [i.split("=", 1)[0] + "=" for i in l.split("\n") if i]

        for i in l:
            if i.islower():
                print(
                    f"possible leak detected, check {destination_file_name} file")

        with open(src / destination_file_name, "w+") as f_2:
            for i in l:
                f_2.write(i + "\n")



if __name__ == '__main__':
    main()