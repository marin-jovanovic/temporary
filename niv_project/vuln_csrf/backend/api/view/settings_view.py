from django.http import JsonResponse
from rest_framework.views import APIView

from backend.api.cqrs_q.users import is_username_in_db
from backend.api.model.users import get_user_model
from backend.api.view.comm import get_auth_ok_response_template, get_auth_err_response_template

# todo add all settings that are hardcoded (game settings, number of players, ...)

class SettingsView(APIView):
    """

    """

    def delete(self, request, username):

        # todo check
        print(username == request.username)

        if not is_username_in_db(request.username):
            print("username not in db")
            response = get_auth_err_response_template(request)
            return JsonResponse(response)

        get_user_model().objects.get(username=request.username).delete()


        response = get_auth_ok_response_template(request)

        response["payload"] = {
            "status": True,
        }
        return JsonResponse(response)



    def get(self, request):

        if not is_username_in_db(request.username):
            print("username not in db")
            response = get_auth_err_response_template(request)
            return JsonResponse(response)

        user = get_user_model().objects.get(
            username=request.username)

        response = get_auth_ok_response_template(request)

        response["payload"] = {
            "status": True,
            "username": user.username,
            "profilePhoto": user.profile_picture,
        }
        return JsonResponse(response)

    def post(self, request):

        username= request.data['username']
        email = request.data['email']
        photo = request.data['profilePhoto']

        if not is_username_in_db(request.username):
            print("username not in db")
            response = get_auth_err_response_template(request)
            return JsonResponse(response)

        user = get_user_model().objects.get(
            username=request.username)

        if username:
            print("not implemented")
            user.username = username
            print(f"{user.username=}")
        if email:
            print("not implemented")
            user.email = email
            print(f"{user.email=}")

        if photo:
            user.profile_picture = photo

        user.save()

        response = get_auth_ok_response_template(request)
        response["payload"]["status"] = True
        return JsonResponse(response)
