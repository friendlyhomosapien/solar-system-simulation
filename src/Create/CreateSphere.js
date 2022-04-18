import {
    SphereGeometry,
    Mesh,
    MeshBasicMaterial,
    PointsMaterial,
    Points,
    TextureLoader,
    ShaderMaterial,
    Vector3,
    Vector2,
    RepeatWrapping
} from 'three';

export default class {
    uniforms;

    constructor(radius = 1, segX = 32, segY = 32) {
        this.geometry = new SphereGeometry( radius, segX, segY );
    }

    createPoints(pointSize = .001, color = 0xffffff) {
        const options = {
            size: pointSize,
            color: color
        };
    
        // Materials
        this.material = new PointsMaterial(options);
    
        // Mesh
        return new Points(this.geometry, this.material);
    }

    createMesh(texture = null, color = null) {
        const options = {};

        if (color) options.color = color;
        if (texture) {
            const loader = new TextureLoader();

            options.map = loader.load(texture);
        }
        this.material = new MeshBasicMaterial(options);
    
        // Mesh
        return new Mesh(this.geometry, this.material);
    }

    createShaderMesh(SurfaceTexture, CloudTexture) {
        const loader = new TextureLoader();
        this.uniforms = {
            'fogDensity': {
                value: 0
            },
            'fogColor': {
                value: new Vector3(0, 0, 0)
            },
            'time': {
                value: 1.0
            },
            'uvScale': {
                value: new Vector2( 3.0, 1.0 )
            },
            'texture1': {
                value: loader.load(CloudTexture)
            },
            'texture2': {
                value: loader.load(SurfaceTexture)
            }
        };

        this.uniforms['texture1'].value.wrapS = this.uniforms['texture1'].value.wrapT = RepeatWrapping;
        this.uniforms['texture2'].value.wrapS = this.uniforms['texture2'].value.wrapT = RepeatWrapping;
        this.material = new ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent

        } );
        return new Mesh(this.geometry, this.material)
    }
}
