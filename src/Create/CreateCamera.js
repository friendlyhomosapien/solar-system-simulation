import { PerspectiveCamera } from "three";

export default function(sizes) {
    const camera = new PerspectiveCamera(
        50,
        sizes.width / sizes.height,
        0.1,
        1000
    );

    return camera;
}
