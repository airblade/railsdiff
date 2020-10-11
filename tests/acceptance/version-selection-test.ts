import { visit } from "@ember/test-helpers";
import { findControl, select } from "ember-semantic-test-helpers/test-support";
import { module, test } from "qunit";

import sample from "../../mirage/scenarios/sample";
import { setupAcceptanceTest } from "../helpers";

function getVersions(label: string) {
  const control = findControl(label) as HTMLSelectElement;
  if (!control) {
    throw new Error(`Control labelled ${label} could not be found`);
  }
  return [...control.options].map((option) => option.label);
}

module("Acceptance | version selection", (hooks) => {
  setupAcceptanceTest(hooks);

  hooks.beforeEach(() => {
    sample(server);
  });

  test("source versions include only branch names beginning with 'v'", async (assert) => {
    await visit("/");

    const sourceVersions = getVersions("Source");
    assert.notOk(sourceVersions.includes("main"));
  });

  test("source versions do not include the latest version", async (assert) => {
    await visit("/");

    assert.notOk(getVersions("Source").includes("2.0.0"));
  });

  test("source versions are listed in descending order", async (assert) => {
    await visit("/");

    assert.deepEqual(getVersions("Source"), ["1.1.1", "1.0.1", "1.0.0"]);
  });

  test("target versions include only versions greater than the selected source version", async (assert) => {
    await visit("/");

    assert.deepEqual(getVersions("Target"), ["2.0.0"]);

    await select("Source", "1.0.1");

    assert.deepEqual(getVersions("Target"), ["2.0.0", "1.1.1"]);
  });

  test("target versions are listed in descending order", async (assert) => {
    await visit("/");
    await select("Source", "1.0.0");

    assert.deepEqual(getVersions("Target"), ["2.0.0", "1.1.1", "1.0.1"]);
  });
});
