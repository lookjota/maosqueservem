import { eventBus } from "./eventBus";

let count = 12; // base inicial simulada

export function getActivityCount() {
  return count;
}

export function startActivityCounter() {
  eventBus.on("volunteer:new", () => {
    count += 1;
  });
}