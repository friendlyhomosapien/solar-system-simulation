import { TextureLoader } from 'three';

export default function (src) {
    const texture = new TextureLoader().load(src);
    if (!texture) {
        console.error('Could not load texture');
        return;
    }
    return texture;
}
