"""
implementation without refresh tokens

access token has unlimited lifetime

password is stored as hash
"""

import base64
import hashlib
from secrets import token_hex

from bcrypt import gensalt, hashpw


def generate_access_token():
    return token_hex(256)


def get_hashed_password(password: str) -> (str, str):
    """
    returns all decoded to utf-8

    from https://pypi.org/project/bcrypt/

    The bcrypt algorithm only handles passwords up to 72 characters, any
    characters beyond that are ignored. To work around this, a common approach
    is to hash a password with a cryptographic hash (such as sha256) and then
    base64 encode it to prevent NULL byte problems before hashing the result
    with bcrypt:
    """

    pass_long = password.encode() * 10

    salt = gensalt()

    hashed = hashpw(base64.b64encode(hashlib.sha256(pass_long).digest()),
                    salt).decode("utf-8")

    return hashed


def is_pass_ok(password: str) -> bool:
    """
    checks if {password} is strong enough
    new parameters can be easily added by appending to the current list of
    parameters

    :param password: password which needs to be checked
    :return: is_password_strong_enough: bool
    """

    # todo remove
    print('auth main; not implemented')
    return True

    flag = True

    # length
    if len(password) < 8:
        print("len of pass not enough")
        flag = False

    # special chars
    test_list = ["?", "!", "%", "&", "@", "$",
                 "+", "-", ".", "_", ",", "\"", "\'"]
    if not any(item in list(password) for item in test_list):
        print("not one special char from ", test_list)
        flag = False

    # digit
    if not any(char.isdigit() for char in password):
        print("no numbers in password")
        flag = False

    # upper case
    if not any(char.isupper() for char in password):
        print("no upper chars in password")
        flag = False

    # lower case
    if not any(char.islower() for char in password):
        print("no lower chars in password")
        flag = False

    return flag
