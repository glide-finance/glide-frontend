import DOMPurify from "dompurify";

const myHTML = `
<!-- include A-Frame -->
<script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
<!-- include ar.js for A-Frame -->
<script src="https://glide-finance/glide-frontend/AR/AR.js-master/aframe/build/aframe-ar.js"></script>

<!-- define your gltf asset -->
<a-assets>
  <a-asset-item id="tree" src="/glide-finance/glide-frontend/AR/shiba/shiba.gltf"></a-asset-item>
</a-assets>

<!-- use your gltf model -->
<a-entity gltf-model="##shiba"></a-entity>

<body style='margin : 0px; overflow: hidden;'>
  <a-scene embedded arjs>
  
    <!-- create your content here. just a box for now -->
    <a-box position='0 0.5 0' material='opacity: 0.5;'></a-box>
	
    <!-- define a camera which will move according to the marker position -->
	<a-marker-camera type='pattern' url='https://glide-finance/glide-frontend/AR/GlideMarker.patt'></a-marker-camera>

  </a-scene>
</body>
`;

const mySafeHTML = DOMPurify.sanitize(myHTML);

const App = () => <div dangerouslySetInnerHTML={{ __html: mySafeHTML }} />;