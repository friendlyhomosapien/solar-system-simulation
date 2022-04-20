import { PointLight, HemisphereLight } from "three";

export default function() {
    const light = new PointLight(0xffffff, 1, 50)
    // const light = new HemisphereLight( 0xffffff, 0x080808, 1.5 );
    return light;
}
