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
				messageA_translateY_out: [0, -20, { start:0.25, end:0.3}]
				// messageB_opacity_in: [0, 1, { start:0.3, end:0.4}]

			}
		},
		{
			//1
			type: 'nomal',
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeigth 세팅
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
				container: document.querySelector('#scroll-section-2')
			}
		},
		{
			//3
			type: 'sticky',
			heightNum: 5,		//	브라우저 높이의 5배로 scrollHeigth 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3')
			}
		}
	];


	function setLayout(){
		// 각 스크롤 섹션의 높이 세팅
		for(let i=0; i < sceneInfo.length; i++){
			sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
				const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
				const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
				const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
				const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);
				if(scrollRatio <= 0.22){
					//  in
					objs.messageA.style.opacity = messageA_opacity_in;
					objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
				}else{
					//  out
					objs.messageA.style.opacity = messageA_opacity_out;
					objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
				}
				
				break;
			case 1:
				break;
			case 2:
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