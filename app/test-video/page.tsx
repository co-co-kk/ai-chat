import { Video } from '@/components/assistant-ui/markdown-text';

export default function TestVideoPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video Component Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Test 1: Basic Video</h2>
          <Video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            controls
            poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            className="w-full max-w-md"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Test 2: Video with Children</h2>
          <Video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            controls
            className="w-full max-w-md"
          >
            <track
              kind="captions"
              srcLang="en"
              label="English captions"
            />
          </Video>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Test 3: No Controls</h2>
          <Video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            controls={false}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
}