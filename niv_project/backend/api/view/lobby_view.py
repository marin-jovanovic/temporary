import json
import urllib

from django.http import JsonResponse
from rest_framework.views import APIView

from backend.api.cqrs_q.users import is_username_in_db
from backend.api.model.users import get_user_model
from backend.api.view.comm import get_auth_ok_response_template, \
    get_auth_err_response_template
from backend.api.model.post import _get_post_model
from django.core import serializers


def get_all(model):
    SomeModel_json = serializers.serialize("json",
                                           model.objects.all())
    data = {"posts": SomeModel_json}

    # print(data["posts"])
    # print(json.loads(data["posts"]))

    feromated = {}
    for i in json.loads(data["posts"]):
        # print(i)
        feromated[i["pk"]] = i['fields']

    return feromated


class LobbyView(APIView):

    def get(self, request, name=None):
        # get basic game info

        print("get games")

        post = _get_post_model().objects.all()
        print(post)

        from django.core import serializers

        from django.forms.models import model_to_dict
        # view:

        # def get modelAPI(request):

        # SomeModel_json = serializers.serialize("json", _get_post_model().objects.all())
        # data = {"posts": SomeModel_json}
        #
        # # print(data["posts"])
        # # print(json.loads(data["posts"]))
        #
        # feromated = {}
        # for i in json.loads(data["posts"]):
        #     # print(i)
        #     feromated[i["pk"]] = i['fields']
        #
        # for i in feromated.items():
        #     print(i)



        # print(JsonResponse(data))

        if not name:
            formated = get_all(_get_post_model())

            for k,v in formated.items():

                user = get_user_model().objects.get(id=v["owner"])
                v["owner"] = user.username

            response = get_auth_ok_response_template(request)
            response["payload"] = {
                "status": True,
                "payload": formated
            }
        else:
            print("not implemented, no use ? ")
            response = get_auth_ok_response_template(request)
            # response['payload'] = get_specific_game(name)

        return JsonResponse(response)

    # todo observers

    def post(self, request, name):

        # name
        capacity = request.data["capacity"]
        description = request.data["description"]

        if not is_username_in_db(request.username):
            print("username not in db")
            response = get_auth_err_response_template(request)
            return JsonResponse(response)

        user = get_user_model().objects.get(
            username=request.username)

        post = _get_post_model()(
            owner = user,
            name = name,
            date = request.data["date"],
            time = request.data["time"],
            geo_lat = "todo",
            geo_lon="todo",
            capacity=capacity,
            description=description,
            reported= False
        )

        post.save()

        # owner = models.ForeignKey(get_user_model(),
        #                           on_delete=models.CASCADE)
        #
        # name = models.TextField(null=True)
        #
        # # todo ref
        # date = models.TextField()
        # time = models.TextField()
        # geo_lan = models.TextField()
        # geo_lon = models.TextField()
        #
        # capacity = models.IntegerField(null=True)
        # description = models.TextField(null=True)

        # print(name, capacity, description)
        #
        # print(f"{creator_username=}")
        # print(f"{capacity=}")

        response = get_auth_ok_response_template(request)
        response["payload"]["status"] = True
        return JsonResponse(response)

    def put(self, request, name):
        # join / leave game
        username = request.username

        response = get_auth_ok_response_template(request)

        action = request.data["action"]

        if action == "delete":
            print("delete")
            _get_post_model().objects.get(id=name).delete()

        elif action == "report":
            print("report")
            t = _get_post_model().objects.get(id=name)
            t.reported = True
            t.save()

        elif action == "update":
            print("update post")

            if request.data["owner"] == username:
                print("ok")
            else:
                print("mismatch")

            index = name
            print(f"{index=}")
            model = _get_post_model().objects.get(id=name)

            print(model)

            for k,v in request.data.items():
                print(k,v)
                if k == "action":
                    continue

                if k in ["name", "date", "time", "geo_lat", "geo_lon",
                         "capacity", "description"]:
                    pass
                else:
                    # todo
                    print("err")
                    continue
                setattr(model, k, v)
                # model[k]  = v


            print(model)
            model.save()

            print(request.data)

        else:
            print("unsupported command in put lobby")

        # if "leave" in request.data:
        #     print("leave")
        #     print("res payload", response)
        #
        # if "join" in request.data:
        #     print("join")

        response["payload"]["status"] = True
        return JsonResponse(response)
