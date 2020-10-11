import EmberRouter from "@ember/routing/router";
import config from "rails-diff/config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route("about");
  this.route("patch", { path: "/:source/:target" });
});
