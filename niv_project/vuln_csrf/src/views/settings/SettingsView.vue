<template>
  <BaseUserTemplate>
    <div class="container-fluid">
      <div class="row">
        <h1>personal info</h1>

        username
        <input v-model="this.username" placeholder="" />
        <br />
        <br />

        email
        <input v-model="this.email" placeholder="" />
        <br />
        <br />

        password
        <input v-model="this.password" placeholder="" type="password" />
        <input v-model="this.passwordConfirm" placeholder="" type="password" />
        <br />

        profile photo

        <div>
          <img v-bind:src="this.profilePhoto" />
          <br />
          <input type="file" accept="image" @change="uploadImage" />
        </div>

        <br />

        <button @click="saveChanges">save changes on profile metadata</button>
        <button>view reviews</button>

        <button @click="deleteAccount">delete account</button>
      </div>

      <BaseNotification ref="notifications"></BaseNotification>
    </div>
  </BaseUserTemplate>
</template>
  
<script>
import BaseNotification from "@/components/BaseNotification.vue";
import { apiSettings } from "@/scripts/api/settings";
import BaseUserTemplate from "@/components/BaseUserTemplate.vue";
import { ssw } from "@/scripts/session_storage";
import { router } from "@/router/router";

export default {
  data() {
    return {
      username: "",
      email: "",
      profilePhoto: "",
      password: "",
      passwordConfirm: "",
      passwordCurrent: "",

      originalUsername: "",
    };
  },
  async mounted() {
    let r = await apiSettings.getSettings();

    if (r["auth"]["status"]) {
      let pl = r["payload"];

      this.username = pl["username"];
      this.profilePhoto = pl["profilePhoto"];

      this.originalUsername = pl["username"];

      //  race cond err
      // this.$refs.notifications.showMessage(
      //   r["payload"]["status"],
      //   `personal info loaded`,
      //   `error loading personal info`
      // );
    }
  },
  methods: {
    async deleteAccount() {
      console.log("delete acc");

      let res = await apiSettings.deleteAccount(this.originalUsername);

      this.$refs.notifications.showMessage(
        res["auth"]["status"] && res["payload"]["status"],
        `post deleted`,
        `error deleting post`
      );

      ssw.remove("username");
      this.returnUrl = "/login";
      router.push(this.returnUrl);
    },

    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.profilePhoto = e.target.result;
        // localStorage.setItem("image", reader.result);
      };
    },

    saveChanges() {
      // todo password
      // console.log("save");
      apiSettings.updateSettings({
        username: this.username,
        email: this.email,
        profilePhoto: this.profilePhoto,
      });
    },
  },
  components: { BaseNotification, BaseUserTemplate },
};
</script>
  
<style>
</style>