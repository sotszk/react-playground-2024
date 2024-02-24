import { memo, useState, useTransition } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import PostsTab from "../components/Posts";

const Slow = memo(function SLow({ count }: { count: number }) {
  if (count === 0) return 0;

  for (let i = 0; i < 300; i++) {
    const startTime = performance.now();
    while (performance.now() - startTime < 1) {
      // Do nothing for 1 ms per item to emulate extremely slow code
    }
  }

  return count;
});

const SlowItems = memo(function SlowItems({ counts }: { counts: number[] }) {
  return counts.map((count, index) => <Slow count={count} key={index} />);
});

export default function Index() {
  const [count, setCount] = useState(0);
  const [isCountUpdating, startCountUpdate] = useTransition();
  const [showPosts, setShowPosts] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          disabled={isCountUpdating}
          onClick={() => {
            const newCount = increment(count);
            startCountUpdate(() => {
              setCount(newCount);
            });
          }}
        >
          {isCountUpdating ? "updating..." : `count is ${count}`}
        </button>
        {/* 非同期処理中はペンディングにならない */}
        <SuperCounter count={count} />
        {count > 0 && <SlowItems counts={Array(count).fill(count)} />}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <button
        onClick={() => {
          startTransition(() => {
            setShowPosts(true);
          });
        }}
      >
        Show posts
      </button>
      <div>{(showPosts && <PostsTab />) || (isPending && "Loading")}</div>
    </>
  );
}

function increment(count: number) {
  return count + 1;
}

function SuperCounter({ count }: { count: number }) {
  return <div style={{ fontSize: 32 }}>SUPER: {count * 99}</div>;
}
