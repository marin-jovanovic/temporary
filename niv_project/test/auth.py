import json
import time

import requests


def create_user(u, p):
    url = "http://localhost:8000/signup"

    t = requests.post(
        f"{url}/{u}",
        headers={
            "Authorization": f"Create {u}:{p}"
        },
        verify=False
    )

    print(json.dumps(json.loads(t.text), indent=4, sort_keys=True))
    return json.loads(t.text)


def auth_user(u, p):
    url = "http://localhost:8000/login"

    t = requests.post(
        f"{url}/{u}",
        headers={
            "Authorization": f"Basic {u}:{p}"
        },
        verify=False
    )

    print(json.dumps(json.loads(t.text), indent=4, sort_keys=True))
    return json.loads(t.text)


def is_valid(u, p):
    url = "http://localhost:8000/validate"

    t = requests.post(
        f"{url}/{u}",
        headers={
            "Authorization": f"Basic {u}:{p}"
        },
        verify=False
    )

    print(json.dumps(json.loads(t.text), indent=4, sort_keys=True))
    return json.loads(t.text)


def logout(u, a):
    url = "http://localhost:8000/logout"

    t = requests.post(
        f"{url}/{u}",
        headers={
            "Authorization": f"Basic {u}:{p}"
        },
        verify=False
    )

    print(json.dumps(json.loads(t.text), indent=4, sort_keys=True))
    return json.loads(t.text)


def main():
    print('running tests')

    username = 'username2'
    password = 'password2'

    create_user(username, password)
    print(80 * "-")

    access_token = auth_user(username, password)["payload"]["payload"]["accessToken"]
    print(f"{access_token=}")
    print(80 * "-")

    validated = is_valid(username, access_token)['payload']
    print(f"{validated=}")
    print(80 * "-")

    logout(username, access_token)

    # return

    while True:

        for i in range(15):
            time.sleep(0.5)

            username = str(i)
            password = str(i)

            # create_user(username, password)
            # print(80 * "-")

            access_token = auth_user(username, password)["payload"]["payload"][
                "accessToken"]
            print(f"{access_token=}")
            print(80 * "-")

            # validated = is_valid(username, access_token)['payload']
            # print(f"{validated=}")
            # print(80 * "-")

            # logout(username, access_token)
        # break

        for i in range(15):
            time.sleep(0.5)

            username = str(i)
            password = str(i)

            # create_user(username, password)
            # print(80 * "-")
            #
            access_token = auth_user(username, password)["payload"]["payload"][
                "accessToken"]
            print(f"{access_token=}")
            print(80 * "-")

            # validated = is_valid(username, access_token)['payload']
            # print(f"{validated=}")
            # print(80 * "-")

            logout(username, access_token)


if __name__ == '__main__':
    main()