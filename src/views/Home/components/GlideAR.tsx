import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading, Skeleton } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import DOMPurify from 'components/dompurify'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const ARHTML = `
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

const mySafeHTML = DOMPurify.sanitize(AR_HTML);

const SafeARHTML = () => <div dangerouslySetInnerHTML={{ __html: mySafeHTML }} />;