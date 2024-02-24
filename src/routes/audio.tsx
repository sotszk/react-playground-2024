import { useState, useEffect } from "react";

export default function Audio() {
  const [status, setStatus] = useState<"recording" | "idle" | "suspended">(
    "idle",
  );
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status) {
      setIsProcessing(false);
    }
  }, [status]);

  const handleClickStart = async () => {
    setIsProcessing(true);
    const audioCtx = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(audioCtx.destination);
    setSource(source);
    setAudioCtx(audioCtx);
    setStatus("recording");
  };

  const handleClickStop = async () => {
    if (!source || !audioCtx) return;
    setIsProcessing(true);
    source.disconnect();
    await audioCtx.close();
    setSource(null);
    setAudioCtx(null);
    setStatus("idle");
  };

  const handleClickSuspend = async () => {
    if (!audioCtx) return;
    setIsProcessing(true);
    await audioCtx.suspend();
    setStatus("suspended");
  };

  const handleClickResume = async () => {
    if (!audioCtx) return;
    setIsProcessing(true);
    await audioCtx.resume();
    setStatus("recording");
  };

  return (
    <div>
      <h1>Audio</h1>
      <div>
        {status === "recording" || status === "suspended" ? (
          <span>録音中</span>
        ) : (
          <button onClick={handleClickStart} disabled={isProcessing}>
            録音開始
          </button>
        )}
        {status !== "suspended" && (
          <button
            style={{ marginLeft: "8px" }}
            onClick={handleClickSuspend}
            disabled={isProcessing}
          >
            一時停止
          </button>
        )}
        {status === "suspended" && (
          <button
            style={{ marginLeft: "8px" }}
            onClick={handleClickResume}
            disabled={isProcessing}
          >
            再開
          </button>
        )}

        <button
          style={{ marginLeft: "8px" }}
          onClick={handleClickStop}
          disabled={isProcessing}
        >
          停止
        </button>
      </div>
    </div>
  );
}
