import {
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial
} from "three";

import DiscTexture from '@/Textures/DiscTexture.png';

import createTexture from '@/Create/CreateTexture.js';

export default class {
    constructor() {
        const geometry = new BufferGeometry();

        const vertices = [];
    
        const sprite = createTexture(DiscTexture)
    
        for ( let i = 0; i < 50000; i ++ ) {
    
            const x = 5000 * Math.random() - 1000;
            const y = 5000 * Math.random() - 1000;
            const z = 5000 * Math.random() - 1000;
    
            vertices.push( x, y, z );
    
        }
    
        geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
    
        this.material = new PointsMaterial( { size: 2, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
        this.material.color.setHSL( 1.0, 1.0, 1 );
    
        const particles = new Points( geometry, this.material );
        return particles;
    }
}
