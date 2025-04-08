<template>
    <div id="kontroles" class="container">
      <div class="parametri">
        <label>
          Platums (B) m:
          <input type="number" min="0.1" step="0.1" v-model.number="platums" />
        </label>
      </div>
  
      <div class="parametri">
        <label>
          Augstums (H) m:
          <input type="number" min="0.1" step="0.1" v-model.number="augstums" />
        </label>
      </div>
  
      <div class="parametri">
        <label>
          Garums (L) m:
          <input type="number" min="0.1" step="0.1" v-model.number="garums" />
        </label>
      </div>
  
      <div class="parametri">
        <label>
          Stiprība (f):
          <input type="number" min="0.1" step="1" v-model.number="stipriba" />
        </label>
      </div>
  
      <div class="parametri">
        <label>
          <h3>{{ rezultāts_q }} KN/m</h3>
        </label>
      </div>
    </div>
  
    <div id="three-container"></div>
  </template>
  
  <script>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import './index.css';
  
  export default {
    data() {
      return {
        platums: 0.1,
        augstums: 0.3,
        garums: 6,
        stipriba: 20000,
      };
    },
  
    computed: {
      rezultāts_q() {
        const W = (this.platums * Math.pow(this.augstums, 2)) / 6;
        const momentCapacity = W * this.stipriba;
        const maxCelt = (8 * momentCapacity) / Math.pow(this.garums, 2);
        return maxCelt.toFixed(2);
      }
    },
  
    methods: {
      init() {
        const container = document.getElementById('three-container');
  
        this.kamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.kamera.position.z = 5;
  
        this.aina = new THREE.Scene();
        this.aina.background = new THREE.Color(0xE2DFD2);
  
        const geometry = new THREE.BoxGeometry(this.platums, this.augstums, this.garums);
        const material = new THREE.MeshBasicMaterial({ color: 0xDAA06D });
        this.mesh = new THREE.Mesh(geometry, material);
        this.aina.add(this.mesh);
  
        this.renderetajs = new THREE.WebGLRenderer({ antialias: true });
        this.renderetajs.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderetajs.domElement);
  
        this.controls = new OrbitControls(this.kamera, this.renderetajs.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
  
        const light = new THREE.AmbientLight(0xffffff, 1);
        this.aina.add(light);
  
        window.addEventListener('resize', this.onWindowResize);
      },
  
      animate() {
        requestAnimationFrame(this.animate);
  
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
  
        this.controls.update();
        this.renderetajs.render(this.aina, this.kamera);
      },
  
      updateCubeSize() {
        if (!this.mesh) return;
  
        
        this.mesh.geometry.dispose();
  
       
        const newGeometry = new THREE.BoxGeometry(this.platums, this.augstums, this.garums);
        this.mesh.geometry = newGeometry;
      },
  
      onWindowResize() {
        const container = document.getElementById('three-container');
        this.kamera.aspect = container.clientWidth / container.clientHeight;
        this.kamera.updateProjectionMatrix();
        this.renderetajs.setSize(container.clientWidth, container.clientHeight);
      }
    },
  
    watch: {
      platums() {
        this.updateCubeSize();
      },
      augstums() {
        this.updateCubeSize();
      },
      garums() {
        this.updateCubeSize();
      }
    },
  
    mounted() {
      this.animate = this.animate.bind(this);
      this.init();
      this.animate();
    },
  
    beforeUnmount() {
      window.removeEventListener('resize', this.onWindowResize);
    }
  };
  </script>
  
  <style>
  #three-container {
    position: fixed;
    right: 0;
    top: 0;
    width: 50%;
    height: 100vh;
    background: #f0f0f0;
    border-left: 2px solid #ccc;
  }
  
  .container {
    width: 35%;
    float: left;
    padding: 20px;
  }
  
  .parametri {
    margin-bottom: 10px;
  }
  </style>
  