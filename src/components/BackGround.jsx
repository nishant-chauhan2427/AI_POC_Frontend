import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

const SparklesBackground = React.memo(() => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#FFFFFF"
      />
    </div>
  );
});

export default SparklesBackground;
