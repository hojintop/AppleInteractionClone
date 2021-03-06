(()=>{

	let yOffset = 0;		//  window.pageYOffset 대입될 변수
	let prevScrollHeight = 0;		//  현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0;		//  현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)
	let enterNewScene = false;		//  새로운 scene 이 시작되는 순간 true

	let acc = 0.1;		// 가속도
	let delayedYOffset = 0; // 딜레이처리될구간
	let rafId;		// animation 처리id
	let rafState;	// animation 처리상태

	const sceneInfo = [
		{
			//0
			type: 'sticky',
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 300,
				imageSequence: [0, 299],
				canvas_opacity: [1, 0, { start: 0.9, end:1 }],
				messageA_opacity_in: [0, 1, { start:0.1, end:0.2}],
				messageA_translateY_in: [20, 0, { start:0.1, end:0.2}],
				messageA_opacity_out: [1, 0, { start:0.25, end:0.3}],
				messageA_translateY_out: [0, -20, { start:0.25, end:0.3}],

				messageB_opacity_in: [0, 1, { start:0.3, end:0.4}],
				messageB_translateY_in: [20, 0, { start:0.3, end:0.4}],
				messageB_opacity_out: [1, 0, { start:0.45, end:0.5}],
				messageB_translateY_out: [0, -20, { start:0.45, end:0.5}],

				messageC_opacity_in: [0, 1, { start:0.5, end:0.6}],
				messageC_translateY_in: [20, 0, { start:0.5, end:0.6}],
				messageC_opacity_out: [1, 0, { start:0.65, end:0.7}],
				messageC_translateY_out: [0, -20, { start:0.65, end:0.7}],

				messageD_opacity_in: [0, 1, { start:0.7, end:0.8}],
				messageD_translateY_in: [20, 0, { start:0.7, end:0.8}],
				messageD_opacity_out: [1, 0, { start:0.85, end:0.9}],
				messageD_translateY_out: [0, -20, { start:0.85, end:0.9}]
			}
		},
		{
			//1
			type: 'nomal',
			//heightNum: 5,		//	브라우저 높이의 5배로 scrollHeight 세팅 - type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1')
			}
		},
		{
			//2
			type: 'sticky',
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
	            messageA: document.querySelector('#scroll-section-2 .a'),
	            messageB: document.querySelector('#scroll-section-2 .b'),
	            messageC: document.querySelector('#scroll-section-2 .c'),
	            pinB: document.querySelector('#scroll-section-2 .b .pin'),
	            pinC: document.querySelector('#scroll-section-2 .c .pin'),
	            canvas: document.querySelector('#video-canvas-1'),
				context: document.querySelector('#video-canvas-1').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 960,
				imageSequence: [0, 959],
				canvas_opacity_in: [0, 1, { start: 0, end:0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end:1 }],
				messageA_opacity_in: [0, 1, { start:0.25, end:0.3}],
				messageA_translateY_in: [20, 0, { start:0.15, end:0.2}],
				messageA_opacity_out: [1, 0, { start:0.4, end:0.45}],
				messageA_translateY_out: [0, -20, { start:0.4, end:0.45}],

				messageB_opacity_in: [0, 1, { start:0.6, end:0.65}],
				messageB_translateY_in: [30, 0, { start:0.6, end:0.65}],
				messageB_opacity_out: [1, 0, { start:0.68, end:0.73}],
				messageB_translateY_out: [0, -20, { start:0.68, end:0.73}],

				messageC_opacity_in: [0, 1, { start:0.87, end:0.92}],
				messageC_translateY_in: [30, 0, { start:0.87, end:0.92}],
				messageC_opacity_out: [1, 0, { start:0.95, end:1}],
				messageC_translateY_out: [0, -20, { start:0.95, end:1}],
				pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
            	pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
			}
		},
		{
			//3
			type: 'sticky',
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas: document.querySelector('.image-blend-canvas'),
				context: document.querySelector('.image-blend-canvas').getContext('2d'),
				imagesPath: ['./images/blend-image-1.jpg' , './images/blend-image-2.jpg'],
				images: []
			},
			values: {
				rect1X: [0, 0, { start: 0, end: 0}],
				rect2X: [0, 0, { start: 0, end: 0}],
				blendHeight: [0, 0, { start: 0, end: 0}],
				canvas_scale: [0, 0, { start: 0, end: 0}],
				canvasCaption_opacity: [0, 1, { start: 0, end:0 }],
				canvasCaption_translateY: [20, 0, { start: 0, end:0 }],
				rectStartY: 0
			}
		}
	];

	function setCanvasImages(){
		let imgElem;
		for(let i=0; i<sceneInfo[0].values.videoImageCount;i++){
			imgElem = new Image();
			imgElem.src = `./video/001/IMG_${6726+i}.JPG`;
			sceneInfo[0].objs.videoImages.push(imgElem);
		}

		let imgElem2;
		for(let i=0; i<sceneInfo[2].values.videoImageCount;i++){
			imgElem2 = new Image();
			imgElem2.src = `./video/002/IMG_${7027+i}.JPG`;
			sceneInfo[2].objs.videoImages.push(imgElem2);
		}

		for(let i=0;i<sceneInfo[3].objs.imagesPath.length; i++){
			imgElem3 = new Image();
			imgElem3.src = sceneInfo[3].objs.imagesPath[i];
			sceneInfo[3].objs.images.push(imgElem3);
		}
	}

	// 상단 메뉴 fixed 및 blur 처리를위한 class 추가 삭제처리
	function checkMenu(){
		if(yOffset >= document.querySelector('.global-nav').clientHeight){
			document.body.classList.add('local-nav-sticky');
		}else{
			document.body.classList.remove('local-nav-sticky');
		}
	}

	function setLayout(){
		// 각 스크롤 섹션의 높이 세팅
		for(let i=0; i < sceneInfo.length; i++){
			if(sceneInfo[i].type === 'sticky'){
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			}else if(sceneInfo[i].type === 'nomal'){
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
			}
			sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
			
		}

		yOffset = window.pageYOffset;
		let totalScrollHeight = 0;
		for(let i=0; i<sceneInfo.length;i++){
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if(totalScrollHeight >= yOffset){
				currentScene = i;
				break;
			}
		}

		document.body.setAttribute('id',`show-scene-${currentScene}`);

		const heightRatio = window.innerHeight / 1080;
		sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
	}

	function calcValues(values, currentYOffset){
		let rv;

		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		//  현재 씬(스크롤섹션) 에서 스크롤된 범위를 비율로 구하기 0~1 사이
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length >= 3) {
			//  start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart &&  currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];		
			}else if(currentYOffset < partScrollStart){
				rv = values[0];
			}else if(currentYOffset > partScrollEnd){
				rv = values[1];
			}
			
		}else{
			rv = scrollRatio * (values[1] - values[0]) + values[0];	
		}
		
		return rv;
	}

	function playAnimation(){
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight; 		//  현재 scene 에서 스크롤된 높이
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		switch (currentScene) {
			case 0:
				// let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence],0,0);
				objs.canvas.style.opacity = calcValues(values.canvas_opacity,currentYOffset);

				if(scrollRatio <= 0.22){
					//  in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_in, currentYOffset)}%,0)`;
				}else{
					//  out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_out, currentYOffset)}%,0)`;
				}

				if(scrollRatio <= 0.42){
					//  in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_in, currentYOffset)}%,0)`;
				}else{ 
					//  out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_out, currentYOffset)}%,0)`;
				}

				if(scrollRatio <= 0.62){
					//  in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0,${calcValues(values.messageC_translateY_in, currentYOffset)}%,0)`;
				}else{
					//  out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0,${calcValues(values.messageC_translateY_out, currentYOffset)}%,0)`;
				}

				if(scrollRatio <= 0.82){
					//  in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0,${calcValues(values.messageD_translateY_in, currentYOffset)}%,0)`;
				}else{
					//  out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0,${calcValues(values.messageD_translateY_out, currentYOffset)}%,0)`;
				}
				
				break;
			case 1:
				break;
			case 2:
				// let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence2],0,0);

				if(scrollRatio <= 0.5){
					//  in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in,currentYOffset);
				}else{
					//  out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out,currentYOffset);
				}

				if(scrollRatio <= 0.32){
					//  in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_in, currentYOffset)}%,0)`;
				}else{
					//  out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_out, currentYOffset)}%,0)`;
				}

				if(scrollRatio <= 0.67){
					//  in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_in, currentYOffset)}%,0)`;
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY,currentYOffset)})`;
				}else{
					//  out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_out, currentYOffset)}%,0)`;
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY,currentYOffset)})`;
				}

				if(scrollRatio <= 0.93){
					//  in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0,${calcValues(values.messageC_translateY_in, currentYOffset)}%,0)`;
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY,currentYOffset)})`;
				}else{
					//  out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0,${calcValues(values.messageC_translateY_out, currentYOffset)}%,0)`;
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY,currentYOffset)})`;
				}

				// currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
				if(scrollRatio > 0.9){
					// 가로/세로 모두 꽉 차게 하기 위해 세팅(계산)
					const objs = sceneInfo[3].objs;
					const values = sceneInfo[3].values;
					const widthRatio = window.innerWidth / objs.canvas.width;
					const heightRatio = window.innerHeight / objs.canvas.height;
					let canvasScaleRatio;

					if(widthRatio <= heightRatio){
						// 캔버스보다 브라우저 창이 홀쭉한 경우
						canvasScaleRatio = heightRatio;
					}else{
						// 캔버스보다 브라우저 창이 납작한 경우
						canvasScaleRatio = widthRatio;
					}

					objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
					objs.context.fillStyle = 'white';
					objs.context.drawImage(objs.images[0],0,0);

					// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
					// window.innerWidth는 스크롤바포함 영역 이어서 스크롤바를뺀 width 값을 적용(body width)
					const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
					const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

					const whiteRectWidth = recalculatedInnerWidth * 0.15;
					values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
					values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
					values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
					values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

					// 좌우 흰색박스 그리기(영역 그리기만....)
					objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
					objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
				}

				break;
			case 3:
				// 단계별 처리를 위한 변수 설정
				let step = 0;
				// 가로/세로 모두 꽉 차게 하기 위해 세팅(계산)
				const widthRatio = window.innerWidth / objs.canvas.width;
				const heightRatio = window.innerHeight / objs.canvas.height;
				let canvasScaleRatio;

				if(widthRatio <= heightRatio){
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					canvasScaleRatio = heightRatio;
				}else{
					// 캔버스보다 브라우저 창이 납작한 경우
					canvasScaleRatio = widthRatio;
				}

				objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objs.context.fillStyle = 'white';
				objs.context.drawImage(objs.images[0],0,0);

				// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
				// window.innerWidth는 스크롤바포함 영역 이어서 스크롤바를뺀 width 값을 적용(body width)
				const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
				const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

				// canvas top 현재 scene에서 처음의 위치를 가져와 이후는 변경되지 않게 하기 위함
				if(!values.rectStartY){
					// 스크롤속도에 따라 오차가 생긴다 (getBoundingClientRect().top) 그러므로 다른방법인 offsetTop 이용
					// values.rectStartY = objs.canvas.getBoundingClientRect().top;
					values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;

					// rect1&2 그려질 타이밍
					values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
				}

				const whiteRectWidth = recalculatedInnerWidth * 0.15;
				values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

				// 좌우 흰색박스 그리기(영역 그리기만....)
				// objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
				// objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);

				// 좌우 흰색 박스 그리기
				objs.context.fillRect(
					parseInt(calcValues(values.rect1X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);
				objs.context.fillRect(
					parseInt(calcValues(values.rect2X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);

				// 이미지 블렌드 처리를 위해 첫번째 canvas 영역이 스크롤 최상단에 닿앗는지여부로 체크
				if(scrollRatio < values.rect1X[2].end){
					step = 1;
					objs.canvas.classList.remove('sticky');
				}else{
					step = 2;
					// 이미지 블렌드 처리
					values.blendHeight[0] = 0;
					values.blendHeight[1] = objs.canvas.height;
					values.blendHeight[2].start = values.rect1X[2].end;
					values.blendHeight[2].end = values.blendHeight[2].start + 0.2;  // 블렌드 속도
					const blendHeight = calcValues(values.blendHeight, currentYOffset);
					
					// 현재는 canvas 크기위 image 의 크기가 같기 때문에 아래의 objs canvas heigth 를 사용 크기가 다른 경우 image  의 네츄럴width 를 사용해야할수 있다.
					objs.context.drawImage(objs.images[1], 0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
														   0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight);

					objs.canvas.classList.add('sticky');
					objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

					// 블렌드 처리 끝나고 canvas scale 축소를 위함
					if(scrollRatio > values.rect1X[2].end){
						values.canvas_scale[0] = canvasScaleRatio;
						values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
						values.canvas_scale[2].start = values.blendHeight[2].end;
						values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

						objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
						objs.canvas.style.marginTop = 0;	// 다시 스크롤이 올라왔을때 margintop 0으로 다시 원상태로 복귀 
					}

					// 축소가 끝나면 sticky(position fixed) class 을 빼주어 정상 스크롤영역이 반영될수 있도록
					if(scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0){
						objs.canvas.classList.remove('sticky');
						objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`; // 블랜드 및 축소 되는속도(0.2)를 맞추어 계산해주어야 하기때문에 *0.4

						// 최하단 텍스트 영역 애니메이션 처리
						values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
						values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
						values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
						values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
						objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
						objs.canvasCaption.style.tranform = `translate3d(0,${calcValues(values.canvasCaption_translateY, currentYOffset)}%,0)`;
					}
				}
				break;
		}
	}

	function scrollLoop(){
		enterNewScene = false;		// scene 이 바뀌는 순간에 오차가 생김으로 쓰는 변수
		prevScrollHeight = 0;
		for(let i=0;i<currentScene;i++){
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if(delayedYOffset > prevScrollHeight+sceneInfo[currentScene].scrollHeight){
			enterNewScene = true;
			if(currentScene < sceneInfo.length-1){
				currentScene++;	
			}
			
			document.body.setAttribute('id',`show-scene-${currentScene}`);
		}

		if(delayedYOffset < prevScrollHeight){
			enterNewScene = true;
			if(currentScene === 0){		//  브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
				return;
			}
			currentScene--;
			document.body.setAttribute('id',`show-scene-${currentScene}`);
		}

		// 새로고침 될때 어차피 id 값으로 속석값이 들어감으로 주석후 위 스크롤되어 현재 씬이 변경될때만 적용되도록 한다.
		// document.body.setAttribute('id',`show-scene-${currentScene}`);

		if (enterNewScene){
			return;	
		}
		
		playAnimation();
	}


	function loop() {
		// 감속도가 적용위치값
		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

		// 새로운scene에 들어간 순간이 아닐때만 실행 (한번건너띔) - scene이 돌아올때 첫image 가 그려지는 문제때문에 적용
		if (!enterNewScene){
			if(currentScene === 0 || currentScene === 2){
				const currentYOffset = delayedYOffset - prevScrollHeight;		
				const objs = sceneInfo[currentScene].objs;
				const values = sceneInfo[currentScene].values;

				let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				// 해당이미지가 존재한다면
				if(objs.videoImages[sequence]){
					objs.context.drawImage(objs.videoImages[sequence],0,0);		
				}
			}
		}

		rafId = requestAnimationFrame(loop);

		if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafId);
			rafState = false;
		}
	}

	// window.addEventListener('DOMContentLoaded', setLayout);		// domcontentloaded 이미지제외 html script 등만 로드 되었을때 실행
	// load의 경우 이미지 포함 모두 로드 되었을때 실행
	window.addEventListener('load', () => {
		document.body.classList.remove('before-load');
		setLayout();

		// 첫로드시 canvas 보일수 있도록 처리
		sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0],0,0);

		// 화면의 중간부분에서 새로고침 했을때 나타나는 비정상적인 동작 버그 수정 -> 스크롤 살짝 되게 처리 
		let tempYOffset = yOffset;		//  현재 위치에서 작동 해야하기때문에
		let tempScrollCount = 0;		// 횟수 제한을 위한 변수
		if(tempYOffset > 0){
			let siId = setInterval(()=>{				// 시간차 필요.
				window.scrollTo(0, tempYOffset);
				tempYOffset += 3;
				tempScrollCount++;
				
				if(tempScrollCount > 10){
					clearInterval(siId);
				}
			},20);
		}

		window.addEventListener('scroll', () => {
			yOffset = window.pageYOffset;
			scrollLoop();
			checkMenu();

			if (!rafState) {
				rafId = requestAnimationFrame(loop);
				rafState = true;
			}
		});

		window.addEventListener('resize', () => {
			// 모바일 디바이스에서는 가로로 바뀔때만 적용되도록
			if (window.innerWidth > 900){
				window.location.reload();
				// setLayout();
				// sceneInfo[3].values.rectStartY = 0;
			}
		});

		//	모바일 기기를 방향을 바꾸어 들었을때(아이폰?)
		window.addEventListener('orientationchange', () =>{
			scrollTo(0, 0);
			setTimeout(()=>{
				window.location.reload();
			}, 500);
		});

		document.querySelector('.loading').addEventListener('transitionend', (e) => {
			document.body.removeChild(e.currentTarget);
		});
	});
	
	setCanvasImages();
	
})();