import { setup, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { useEffect } from "react";

const countMachine = setup({
  types: {
    context: {} as { count: number },
    events: {} as { type: "inc" } | { type: "count" },
  },
  actions: {
    increment: assign({ count: ({ context }) => context.count + 1 }),
  },
}).createMachine({
  initial: "inactive",
  context: { count: 0 },
  on: {
    inc: {
      actions: "increment",
    },
  },
  states: {
    inactive: {
      on: {
        count: "active",
      },
    },
    active: {
      on: {
        count: "inactive",
      },
    },
  },
});

export default function About() {
  const [state, send, actorRef] = useMachine(countMachine);

  useEffect(() => {
    const subscription = actorRef.subscribe((snapshot) => {
      if (!state.matches(snapshot.value)) {
        console.log("state:", snapshot.value);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [actorRef, state]);

  return (
    <>
      <div>About</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "8px",
          marginTop: "24px",
        }}
      >
        <div>
          Change state:
          <button onClick={() => send({ type: "count" })}>
            state: {state.matches("active") ? "active" : "inactive"}
          </button>
        </div>
        <div>
          Inc action:
          <button onClick={() => send({ type: "inc" })}>
            count: {state.context.count}
          </button>
        </div>
      </div>
    </>
  );
}
