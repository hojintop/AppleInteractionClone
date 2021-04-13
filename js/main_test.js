(()=>{

	let yOffset = 0;		//  window.pageYOffset 대입될 변수
	let prevScrollHeight = 0;		//  현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0;		//  현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)
	let enterNewScene = false;		//  새로운 scene 이 시작되는 순간 true

	const sceneInfo = [
		{
			//0
			type: 'sticky',
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeigth 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d')
			},
			values: {
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
			//heightNum: 5,		//	브라우저 높이의 5배로 scrollHeigth 세팅 - type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1')
			}
		},
		{
			//2
			type: 'sticky',
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeigth 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
	            messageA: document.querySelector('#scroll-section-2 .a'),
	            messageB: document.querySelector('#scroll-section-2 .b'),
	            messageC: document.querySelector('#scroll-section-2 .c'),
	            pinB: document.querySelector('#scroll-section-2 .b .pin'),
	            pinC: document.querySelector('#scroll-section-2 .c .pin')

			},
			values: {
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
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeigth 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				canvasCaption: document.querySelector('.canvas-caption')
			}
		}
	];


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
				break;
			case 3:
				break;
		}
	}

	function scrollLoop(){
		enterNewScene = false;
		prevScrollHeight = 0;
		for(let i=0;i<currentScene;i++){
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if(yOffset>prevScrollHeight+sceneInfo[currentScene].scrollHeight){
			enterNewScene = true;
			currentScene++;
			document.body.setAttribute('id',`show-scene-${currentScene}`);
		}

		if(yOffset<prevScrollHeight){
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

	
	window.addEventListener('scroll', () => {
		yOffset = window.pageYOffset;
		scrollLoop();
	});

	// window.addEventListener('DOMContentLoaded', setLayout);		// domcontentloaded 이미지제외 html script 등만 로드 되었을때 실행
	window.addEventListener('load', setLayout);		// load의 경우 이미지 포함 모두 로드 되었을때 실행
	window.addEventListener('resize', setLayout);
	
	
})();