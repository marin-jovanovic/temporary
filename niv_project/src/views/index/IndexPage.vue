<template>
  <BaseUserTemplate>
    <!-- <img
      src="simple xss"
      onerror="alert('session token:'+ sessionStorage.getItem('accessToken'))"
    /> -->

    <!-- template: `<div>` + userProvidedString + `</div>` // NEVER DO THIS -->
    <div v-html="$alert('ppp')"></div>

    <div class="row">
      <h2>create new post</h2>

      <input
        type="text"
        class="form-control"
        placeholder="name"
        v-model="this.postName"
      />
      <input
        type="text"
        class="form-control"
        placeholder="capacity"
        v-model="this.postCapacity"
      />
      <input
        type="text"
        class="form-control"
        placeholder="description"
        v-model="this.postDescription"
      />
      <br />
      date:
      <input
        type="date"
        class="form-control"
        v-model="this.postDate"
        placeholder="Date"
      />
      <br />
      time:
      <input
        type="time"
        class="form-control"
        v-model="this.postTime"
        placeholder="Time"
      />

      <button @click="createPost">create</button>
    </div>

    <div class="row">
      <h2>posts</h2>
      <div v-for="(item, index) in this.posts" :key="index">
        {{ item }}
        <br />
        host: {{ item["owner"] }}
        <br />
        post name :
        <input
          type="text"
          class="form-control"
          v-model="item.name"
          placeholder="Portfolio name"
        />
        <br />
        date:
        <input
          type="date"
          class="form-control"
          v-model="item.date"
          placeholder="Portfolio name"
        />
        <br />
        time :
        <input
          type="time"
          class="form-control"
          v-model="item.time"
          placeholder="Portfolio name"
        />
        <br />
        todo rewrite as float when map is added geo : {{ item["geo_lat"] }}
        {{ item["geo_lon"] }}
        <br />
        capacity:
        <input
          type="text"
          class="form-control"
          v-model="item.capacity"
          placeholder="Portfolio name"
        />
        <br />
        description:
        <input
          type="text"
          class="form-control"
          v-model="item.description"
          placeholder="Portfolio name"
        />
        <div v-if="item['owner'] == this.username">
          <button @click="deletePost(index)">delete</button>
          <button @click="editPost(index)">update</button>
        </div>
        <div v-else><button @click="reportPost(index)">report</button></div>
        <hr />
      </div>
    </div>

    <BaseNotification ref="notifications"></BaseNotification>
  </BaseUserTemplate>
</template>

<script>
// import { useToast } from "vue-toastification";
import BaseUserTemplate from "@/components/BaseUserTemplate.vue";
import { apiLobby } from "@/scripts/api/lobby";
import { ssw } from "@/scripts/session_storage";
import BaseNotification from "@/components/BaseNotification.vue";

export default {
  setup() {
    // const toast = useToast();
    // return { toast };
  },

  async mounted() {
    this.username = ssw.get("username");

    await this.getAllGames();
  },
  data() {
    return {
      postName: "",
      postCapacity: "",
      postDescription: "",
      postDate: "",
      postTime: "",

      posts: {},
      usenrame: "",
    };
  },
  methods: {
    async editPost(index) {
      console.log("todo edit", index);

      console.table(this.posts[index]);
      console.log(this.posts[index]);

      let res = await apiLobby.updatePost(index, this.posts[index]);

      this.$refs.notifications.showMessage(
        res["auth"]["status"] && res["payload"]["status"],
        `post updated`,
        `error updating post`
      );
    },
    async deletePost(index) {
      let res = await apiLobby.modifyPost(index, "delete");

      this.$refs.notifications.showMessage(
        res["auth"]["status"] && res["payload"]["status"],
        `post deleted`,
        `error deleting post`
      );
    },
    async reportPost(index) {
      let res = await apiLobby.modifyPost(index, "report");

      this.$refs.notifications.showMessage(
        res["auth"]["status"] && res["payload"]["status"],
        `post reported`,
        `error reporting post`
      );
    },

    async getAllGames() {
      let res = await apiLobby.getGames();
      console.log("load", res);
      if (res["auth"]["status"]) {
        if (res["payload"]["status"]) {
          console.log("games", res);

          let pl = res["payload"]["payload"];
          console.table(pl);

          this.posts = pl;
        }
      }
    },

    async createPost() {
      let res = await apiLobby.createGame(
        this.postName,
        this.postCapacity,
        this.postDescription,
        this.postDate,
        this.postTime
      );

      this.$refs.notifications.showMessage(
        res["auth"]["status"] && res["payload"]["status"],
        `post created`,
        `error creating post`
      );

      // console.log("load", res);
      // if (res["auth"]["status"]) {
      //   if (res["payload"]["status"]) {
      //     this.isCreator = true;

      //     console.log("game created ok");
      //   }
      // }
    },
  },
  components: {
    BaseUserTemplate,
    BaseNotification,
  },
};
</script>

<!-- <template>
  <BaseUserTemplate>
    <input
      type="text"
      class="form-control"
      placeholder="game name"
      v-model="gameName"
    />
    <input
      type="text"
      class="form-control"
      placeholder="game capacity"
      v-model="gameCapacity"
    />

    <button @click="createGame">create game</button>

    <hr />
    <h1>not full</h1>
    <hr />

    <div v-for="i in this.notFull" :key="Object.values(i)">
      {{ i }}

      <button @click="joinGame(i.name)">join</button>

      <div v-for="p in i.players" :key="p">
        <div v-if="p == this.username">
          <h1>here</h1>
          <button @click="leaveGame(i.name)">leave</button>
        </div>
      </div>

      <hr />
    </div>

    <hr />
    <h1>full</h1>
    <hr />

    <div v-for="i in this.full" :key="Object.values(i)">
      {{ i }}
      <div v-for="p in i.players" :key="p">
        <div v-if="p == this.username">
          <h1>here</h1>
          <div v-if="this.isCreator">
            <button @click="startGame()">start</button>
          </div>
          <button @click="leaveGame(i.name)">leave</button>
        </div>
      </div>

      <hr />
    </div>

    <div>
      active users:
      <div v-for="i in this.activeUsers" :key="i">
        {{ i }}
      </div>
    </div>

    <BaseMessage ref="message"></BaseMessage>
  </BaseUserTemplate>
</template>

<script>
import { useToast } from "vue-toastification";
import BaseUserTemplate from "@/components/BaseUserTemplate.vue";
import BaseMessage from "@/components/BaseMessage.vue";
import { apiLobby } from "@/scripts/api/lobby";
import { wsListeners } from "@/scripts/ws_listener";
import { router } from "@/router/router";

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },

  async mounted() {
    this.username = sessionStorage.getItem("username");
    console.log("this username", this.username);
    await this.fetchInitData();

    let url = "ws://127.0.0.1:8000/lobby_games/";
    new wsListeners.WebSocketListener(url, this.getUserActive);
    console.log("ws init");
  },
  data() {
    return {
      gameName: "",
      gameCapacity: "",

      full: {},
      notFull: {},

      username: "",

      isCreator: false,
      canStart: false,

      activeUsers: {},
    };
  },
  methods: {
    getUserActive(message) {
      console.log("ws get user active");
      console.log(message);

      this.activeUsers = message;
      this.fetchInitData();
    },

    async joinGame(gameName) {
      let res = await apiLobby.joinGame(gameName);
      console.log("load", res);
      if (res["auth"]["status"]) {
        if (res["payload"]["status"]) {
          console.log("game join ok");
        }
      }

      sessionStorage.setItem("gameId", gameName);
    },

    async leaveGame(gameName) {
      let res = await apiLobby.leaveGame(gameName);
      console.log("load", res);
      if (res["auth"]["status"]) {
        if (res["payload"]["status"]) {
          console.log("game left ok");
        }
      }
    },

    async createGame() {
      let res = await apiLobby.createGame(this.gameName, this.gameCapacity);
      console.log("load", res);
      if (res["auth"]["status"]) {
        if (res["payload"]["status"]) {
          this.isCreator = true;

          console.log("game created ok");
        }
      }
    },

    async fetchInitData() {
      let res = await apiLobby.getGames();
      if (res["auth"]["status"]) {
        this.full = res["payload"]["payload"]["full"];
        this.notFull = res["payload"]["payload"]["not full"];

        let inGame = res["payload"]["payload"]["inGame"];

        console.log("in game", inGame);

        if (inGame in this.full) {
          sessionStorage.setItem("gameId", inGame);

          router.push(`game/${inGame}`);
        }
      } else {
        console.log("err fetching data");
      }
    },
  },
  components: {
    BaseUserTemplate,
    BaseMessage,
  },
};
</script> -->