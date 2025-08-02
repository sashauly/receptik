import {
  type AppleDeviceName,
  type AppleDeviceSize,
  AppleSplashScreenName,
  AppleSplashScreens,
  appleSplashScreenSizes,
  AppleTouchStartupImageOptions,
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";
import { ResizeOptions } from "sharp";

const devices: AppleDeviceName[] = ['iPad Air 9.7"', "iPhone 6"];

function createCustomAppleSplashScreens(
  options: {
    padding?: number;
    resizeOptions?: ResizeOptions;
    darkResizeOptions?: ResizeOptions;
    linkMediaOptions?: AppleTouchStartupImageOptions;
    name?: AppleSplashScreenName;
  } = {},
) {
  const { padding, resizeOptions, darkResizeOptions, linkMediaOptions, name } =
    options;

  return <AppleSplashScreens>{
    sizes: devices.map((deviceName) => {
      const size = appleSplashScreenSizes[deviceName];
      if (deviceName === "iPhone 6") {
        return <AppleDeviceSize>(<unknown>{
          size: { ...size, padding: 0.4 },
          darkResizeOptions: { background: "#2f2f2f" },
          name: (landscape, size, dark) =>
            `iphone6-${landscape ? "landscape" : "portrait"}${dark ? "-dark" : ""}.png`,
        });
      }

      return size;
    }),
    padding,
    resizeOptions,
    darkResizeOptions,
    linkMediaOptions,
    name,
  };
}

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...minimal2023Preset,
    appleSplashScreens: createCustomAppleSplashScreens({
      padding: 0.5,
      darkResizeOptions: { background: "#1f1f1f" },
    }),
  },
  images: ["public/man-cook.svg"],
});
