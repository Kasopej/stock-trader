<template>
  <form class="w-50 m-auto mt-5">
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
      />
    </div>
    <div class="mb-4">
      <label for="exampleInputPassword1" class="form-label">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword1" />
      <i class="inputIcon fa-solid fa-eye"></i>
    </div>
    <button
      type="submit"
      class="btn btn-primary rounded-pill d-block w-50 m-auto"
    >
      Submit
    </button>
  </form>
</template>

<script>
export default {
  created() {
    console.log("created login");
  },
};
</script>

<style scoped>
form > div {
  position: relative;
}
.inputIcon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
