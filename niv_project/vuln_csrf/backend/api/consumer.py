import asyncio
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from backend.api.model.message import message_notifier


class Consumer(AsyncJsonWebsocketConsumer):

    # def __init__(self, notifier=None):
    #     # super().__init__(*args, **kwargs)
    #     self.notifier = notifier

    async def connect(self):
        # self.notifier.attach(self)

        await self.accept()

    def update(self, msg):
        async def driver(pl):
            await self.send(pl)

        asyncio.run(driver(msg))

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        t = {"rec ans": "todo practice consumer"}

        t = json.dumps(t)
        await self.send(t)

    # async def disconnect(self, code):
    # self.notifier.detach(self)


#


# trigger on new message
class MessageConsumer(Consumer):

    async def connect(self):
        message_notifier.attach(self)
        await self.accept()

    async def disconnect(self, code):
        message_notifier.detach(self)

