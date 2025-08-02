import "./index.css";

Promise.all([import("@/root"), import("@/App")]).then(
  ([{ default: render }, { default: App }]) => {
    render(App);
  },
);
