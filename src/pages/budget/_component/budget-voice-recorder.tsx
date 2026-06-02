import { useRef, useState } from "react";
import { Mic, Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useProcessVoiceTransactionMutation } from "@/features/transaction/transactionAPI";
import { AIScanReceiptData } from "@/features/transaction/transationType";

interface BudgetVoiceRecorderProps {
  loadingChange: boolean;
  onLoadingChange: (isLoading: boolean) => void;
  onVoiceComplete: (data: AIScanReceiptData) => void;
}

const BudgetVoiceRecorder = ({
  loadingChange,
  onLoadingChange,
  onVoiceComplete,
}: BudgetVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasProcessedVoice, setHasProcessedVoice] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [processVoiceTransaction] = useProcessVoiceTransactionMutation();

  const {
    progress,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const clearRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setHasProcessedVoice(false);
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error("Could not access microphone. Please check permissions.");
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const processVoiceRecording = async () => {
    if (!audioBlob) {
      toast.error("No recording found");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    startProgress(10);
    onLoadingChange(true);

    let currentProgress = 10;
    const interval = setInterval(() => {
      const increment = currentProgress < 90 ? 15 : 1;
      currentProgress = Math.min(currentProgress + increment, 90);
      updateProgress(currentProgress);
    }, 300);

    try {
      const result = await processVoiceTransaction(formData).unwrap();
      if (!result?.success || !result.data) {
        throw new Error(
          result?.data?.error ||
            "Unable to process voice recording. Please try again."
        );
      }

      updateProgress(100);
      onVoiceComplete(result.data);
      setHasProcessedVoice(true);
      toast.success("Voice processed! Budget form has been filled.");
      clearRecording();
    } catch (error: unknown) {
      let errorMessage = "Failed to process voice recording";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "data" in error
      ) {
        const apiError = error as {
          data?: { data?: { error?: string }; message?: string };
        };
        errorMessage =
          apiError.data?.data?.error ||
          apiError.data?.message ||
          errorMessage;
      }

      toast.error(
        errorMessage.includes("timeout")
          ? "Voice processing timed out. Please try with shorter audio."
          : errorMessage
      );
    } finally {
      clearInterval(interval);
      doneProgress();
      resetProgress();
      onLoadingChange(false);
    }
  };

  const resetAll = () => {
    clearRecording();
    setHasProcessedVoice(false);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Voice Budget</Label>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-center gap-4">
          {!isRecording && !audioBlob && !hasProcessedVoice && (
            <Button
              type="button"
              onClick={startRecording}
              disabled={loadingChange}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                <span className="text-sm font-medium">Recording...</span>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(recordingDuration)}
                </span>
              </div>
              <Button
                onClick={stopRecording}
                size="sm"
                variant="destructive"
                type="button"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </div>
          )}

          {audioBlob && !loadingChange && !hasProcessedVoice && (
            <div className="flex w-full flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="button"
                  onClick={isPlaying ? pauseAudio : playAudio}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  {formatDuration(recordingDuration)}
                </span>
                <Button
                  onClick={clearRecording}
                  size="sm"
                  variant="ghost"
                  type="button"
                  className="flex items-center gap-2"
                >
                  Clear
                </Button>
              </div>

              <Button
                type="button"
                onClick={processVoiceRecording}
                size="default"
                className="w-full max-w-48"
              >
                Process Recording
              </Button>
            </div>
          )}
        </div>

        {hasProcessedVoice && (
          <div className="flex items-center justify-center">
            <Button
              type="button"
              onClick={resetAll}
              size="default"
              variant="outline"
              className="flex w-full max-w-48 items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Reset & Start Fresh
            </Button>
          </div>
        )}

        {loadingChange && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">
              Processing voice budget... {progress}%
            </p>
          </div>
        )}

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="hidden"
          />
        )}
      </div>

      <p className="px-2 text-xs text-muted-foreground">
        Tip: Say your monthly budget and category amount clearly. Example:
        "Set my monthly budget to 50000 and groceries limit to 10000."
      </p>
    </div>
  );
};

export default BudgetVoiceRecorder;
