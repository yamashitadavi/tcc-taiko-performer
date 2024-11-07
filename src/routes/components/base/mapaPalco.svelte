<script lang="ts">
	import ArrowLeft from './../icons/arrowLeft.svelte';
	import Check from './../icons/check.svelte';
	import Edit from './../icons/edit.svelte';
	import Plus from './../icons/plus.svelte';
	import { Instrumento, InstrumentoMusica } from '../classes/classes';
	import FormInstrumentoMusica from '../forms/formInstrumentoMusica.svelte';
	import Search from '../icons/search.svelte';
	import X from '../icons/x.svelte';
	import FormInstrumento from './../forms/formInstrumento.svelte';	
	import Input from './input.svelte';
	import { onMount } from 'svelte';
	
	export let instrMus : Array<InstrumentoMusica> = []
	export let instrumentos : Array<Instrumento> = []
	export let url = '/'
	export let width : any
	export let height : any
	export let espaco : any
	export let musicaId : any
	export let editing : any = false
	export let toDelete : any = []

	let instForm : any,
	offsetX : any, offsetY: any,
	dKeyX : any, dKeyY : any,
	dragging : any,
	targetSize = { eW: 0, eH: 0 },
	frame : any = { posX: 0, posY: 0, zoom: 1.0 }

	const menu1 : any = { width: document.body.clientWidth/7 },
	menu2 : any = { width: document.body.clientWidth/7 };
	
	let selectedIdx: number|undefined = undefined,
	ceInstrumento : any = new Instrumento({}),
	oldCeInstrumento : any = new Instrumento({}),
	insCreate = false,
	insEdit = false,
	searchInst = '',
	svg : any, container : any;

	$: filteredInst = (() =>{
		let val;
		searchInst && (val = instrumentos.filter((e : any) => e.nome.includes(searchInst)))
		return val ? val : instrumentos
	})()

	onMount(() => {

		if (!(+width && +height)) {
			console.log('setta')
			width = 1280
			height = 720
			!espaco && (espaco = 100)
		} 

		const containerSize = container.getBoundingClientRect()
		if (containerSize.width < width || containerSize.height < height) {
			console.log('frames')
			frame = {
				zoom: Math.min(
					containerSize.width / width,
					containerSize.height / height
				),
				posX: (containerSize.width-(width*frame.zoom))/2,
				posY: (containerSize.height-(height*frame.zoom))/2
			}
		}

	})

	function getObj(idx : any) {

		if (idx == 'menu1') return menu1
		if (idx == 'menu2') return {width:0}
		if (idx == 'frame') return frame
		
		return instrMus[idx]
	}

	function onDragStart(e : any, idx : any, keyX? : any, keyY? : any) {

		if (e?.touches && e.touches.length == 2) {
			pinchStart(e)
			return;
		}

		const type = typeof idx == 'number'
		if (!editing && type) return 
		e.stopPropagation();
		if (keyX == undefined && keyY == undefined) {
			keyX = 'posX'
            keyY = 'posY'
			console.log('e.target.tagName.toLowerCase()', e.target.tagName.toLowerCase())
			let tar = e.target.tagName.toLowerCase() == 'div' ? e.target.parentNode.previousElementSibling : e.target
			console.log(tar)
			const { width : eW, height : eH } = tar.getBoundingClientRect()
			targetSize = { eW, eH }
		}

		dKeyX = keyX
		dKeyY = keyY

		dragging = idx

		if (type) 
			selectedIdx = idx

		const scaleFactor = type ? frame.zoom : 1

		if (keyX) {
			offsetX = ((e.clientX ?? e.touches[0].clientX))/scaleFactor
			offsetX = offsetX - getObj(idx)[keyX]
		}
		if (keyY) {
			offsetY = ((e.clientY ?? e.touches[0].clientY))/scaleFactor
			offsetY = offsetY - getObj(idx)[keyY]
		}
	}

	function onDrag(e : any) {
		if (e?.touches && e.touches.length == 2) {
			pinchMove(e)
			return;
		}
		const type = typeof dragging == 'number'
		if (dragging == undefined || (!editing && type)) return

		const scaleFactor = type ? frame.zoom : 1

		if (dKeyY) {
			const cy = (e.clientY ?? e.touches[0].clientY)/scaleFactor
			let y = cy - offsetY
			if (dragging == 'frame') {
				frame.posY = y
			} else 
				instrMus[dragging].posY = posLimit(y, height-targetSize.eH/scaleFactor)+''
		}	

		if (dKeyX) {
			//new mouse position
			const cx = (e.clientX ?? e.touches[0].clientX)/scaleFactor
			let x = cx - offsetX
			if (dragging == 'menu1') menu1[dKeyX] = x
			else if (dragging =='menu2') {
				menu2[dKeyX] = menu2[dKeyX] + (offsetX - cx)
				offsetX = cx
			} else if (dragging == 'frame') {
				frame.posX = x
			} else 
				instrMus[dragging].posX = posLimit(x, width-targetSize.eW/scaleFactor)+''
			
		}
	}	

	function posLimit(v : any, l : any) {
		return v < 0 ? 0 : v > l ? l : v;
	}

	function onDragEnd(e : any) {
		dragging = undefined
	}

	function delInsMusica(idxDel : any) {
		instrMus = instrMus.filter((e : any, idx : any) => {
			const x = idx == idxDel
			if (x) {
				if (e.id) toDelete.push(e)
				if (idxDel == selectedIdx) selectedIdx = undefined
			}
			return !x
		})
	}

	function onDropInstrumento(e : any) {
		pushInstrumento(instrumentos.find((x : any) => x.nome == e.dataTransfer?.getData('target')), e.offsetX, e.offsetY)
		console.log(e)
	}

	function pushInstrumento(instrumento : any, x : any, y : any) {

		if ((x+instrumento.tamanhoX) > width) x = width - instrumento.tamanhoX
		if ((y+instrumento.tamanhoY) > height) y = height - instrumento.tamanhoY
		
		instrMus.push(new InstrumentoMusica({
			instrumento: instrumento, 
			instrumentoId: instrumento.id,
			musicaId, 
			terTocador: true, 
			posicaoX: x,
			posicaoY: y, 
			nome: instrumento.nome, 
			tamanhoX: instrumento.tamanhoX, 
			tamanhoY: instrumento.tamanhoY
		}))
		instrMus = instrMus

	}

	function blurInstrumento(e : any) {
		const key = e.target.name

		if (['files','_imagem', 'tipoImagem'].includes(key)) return
		let hasChange;
		instrMus.forEach((k : any) => {
			if (k.instrumentoId == oldCeInstrumento.id) {
				if (k[key] == oldCeInstrumento[key]) {
					k[key] = k.instrumento[key]
					console.log(key)
					console.table({posX: k.posX, posY: k.posY, tamanhoX: k.tamanhoX, tamanhoY: k.tamanhoY,width, height})
					if (key == 'tamX') k.posX = (+k.posX+k.tamanhoX) > +width ? +width-k.tamanhoX : k.posX
					if (key == 'tamY') k.posY = (+k.posY+k.tamanhoY) > +height ? +height-k.tamanhoY : k.posY
					console.log(k.posY, k.posY+k.tamanhoY)
					hasChange = true
				}
			}
		})
		if (hasChange) instrMus = instrMus
	}

	function setInstrumentoIndex(idx :any) {
		selectedIdx = idx
		oldCeInstrumento = new Instrumento(instrMus[idx].instrumento)
	}
	
	let initialPinch = 0;

	function pinchStart(e : any) {
		if (e.touches.length != 2) return;
		initialPinch = getPinchDist(e.touches);
	}

	function getPinchDist(touches : any) {
		const [ t1, t2 ] = touches,
		dx = t2.clientX - t1.clientX,
		dy = t2.clientY - t1.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}
	function pinchMove(e : any) {
		if (e.touches.length != 2) return;
		const curDist = getPinchDist(e.touches),
		delta = curDist-initialPinch
		let x = (frame.zoom + (delta/120));

		if (x > 0.2 && x < 1.2) frame.zoom = x
		
		initialPinch = curDist
	}
			
</script>
<div role="cell" tabindex="0" class="h-full w-full outline-none flex" on:mouseup={onDragEnd} on:touchend={onDragEnd}
on:mouseleave={onDragEnd} on:touchcancel={onDragEnd} on:mousemove={onDrag} on:touchmove={onDrag}
on:keyup={(e)=>{ if (e.key == 'Enter') selectedIdx = undefined}}>

	{#if editing}
	<menu class="h-full flex relative select-none flex-col overflow-auto bg-base-200" style:width={menu1.width+'px'}>
		<div class="menu flex flex-row max-h-full overflow-y-auto w-full max-w-full rounded-none p-0 py-2">
			{#each instrMus as ins, i}
				<div class="flex flex-row w-full" class:bg-base-300={i == selectedIdx}>
					<button class="btn-sidemenu w-auto flex-none " title="Deletar" on:click|stopPropagation={()=>delInsMusica(i)}><X className="text-red-400"></X></button>
					<button class="btn-sidemenu w-full px-1" title="Selecionar" on:click|stopPropagation={()=> setInstrumentoIndex(i)}>{ins.nome || ins.instrumento}</button>
				</div>
			{/each}
		</div>
		<div role="button" tabindex="0" class="absolute top-0 right-0 h-full bg-neutral cursor-ew-resize w-[2px] z-20
		hover:w-[3px] hover:bg-primary active:w-[3px] active:bg-primary transition-all " on:mousedown={(e)=>onDragStart(e, 'menu1', 'width')} on:touchstart={(e)=>onDragStart(e, 'menu1', 'width')}>
		</div>
	</menu>
	{/if}
	
	<!-- Editor -->
	<div role="cell" tabindex="0" class="overflow-hidden flex-1 min-w-[40%] outline-none transparent-scrollbar p-20 relative touch-none editor" 
	class:cursor-grabbing={dragging == 'frame'}
	bind:this={container}
	data-editing={editing}
	on:mousedown={(e)=>onDragStart(e, 'frame')} on:touchstart={(e)=>onDragStart(e, 'frame')} 
	on:dragover|preventDefault
	on:click={()=> selectedIdx = undefined} on:keyup={(e)=>{}} 		
	>
		<svg role="cell" tabindex="0" 
		bind:this={svg} on:wheel={(e)=>{
			const wx = frame.zoom - (e.deltaY/1000)
			if (wx > 0.2 && wx < 1.2){
				frame.zoom = wx
				e.preventDefault()
			}
		}}

		on:drop={(e)=>onDropInstrumento(e)} 

		class="border border-base-content outline-none absolute " 
		
		style:left={frame.posX}
		style:top={frame.posY}

		style="box-shadow: 0 0 2em rgba(0,0,0,0.1); transform: scale({frame.zoom});"
		  {width} {height} xmlns="http://www.w3.org/2000/svg" on:keyup={(e)=>{
			e.key == 'Delete' && selectedIdx!= undefined && delInsMusica(selectedIdx)
		}}>
			<defs>
				<pattern id="partern" width={espaco} height={espaco} patternUnits="userSpaceOnUse">
					<line x1={espaco} y1="0" x2={espaco} y2={espaco} class="stroke-base-content" stroke-width="1"/>
					<line x1="0" y1={espaco} x2={espaco} y2={espaco} class="stroke-base-content" stroke-width="1"/>
				</pattern>
			</defs>

			<rect width="100%" height="100%" fill="url(#partern)" />

			{#each instrMus as ins, i}
				<image role="button" tabindex="0" 
				xlink:href={(ins.instrumento ?? {})._imagem}
				x={ins.posX} y={ins.posY} width={ins.tamX} height={ins.tamY} class="bg-base-200 instrument " class:active={selectedIdx == i} class:hasTocador={ins.terTocador}
					on:click|stopPropagation={()=>{ setInstrumentoIndex(i) }} 
					on:keydown|stopPropagation={(e)=>{ if (e.key == 'Enter') setInstrumentoIndex(i) }} 
					on:mousedown={(e)=>onDragStart(e, i)} on:touchstart={(e)=>onDragStart(e, i)} />
				{#if ins.terTocador}
				<foreignObject class="outline-none h-[52px] md:h-[36px]" width={ins.tamX} x={ins.posX} y={+ins.posY > 36 ? +ins.posY-36 : ins.posY} 	
					role="button" tabindex="-1" 
					on:click|stopPropagation={()=>{ setInstrumentoIndex(i);}} 
					on:keydown|stopPropagation={(e)=>{ if (e.key == 'Enter') setInstrumentoIndex(i) }} 
					on:mousedown={(e)=>onDragStart(e, i)} on:touchstart={(e)=>onDragStart(e, i)} >
					<div title={ins.nome} class="select-none bg-base-100 w-min truncate max-w-full m-auto px-2 py-1 rounded-md border-base-content border text-lg md:text-base">
						{ins.nome}
					</div>
				</foreignObject>
				{/if}
			{/each}
		</svg>
	</div>

	{#if editing}
	<menu class="h-full flex relative select-none overflow-hidden " style:width={menu2.width+'px'}>
		<div class="overflow-y-auto w-full flex flex-col overflow-x-hidden">
			<h4 class="px-4 py-2 border-b border-neutral text-right bg-base-200 ">{selectedIdx != undefined ? 'Instrumento' : 'Layout'}</h4>
			<div class="overflow-y-auto h-full">
				{#if selectedIdx != undefined && instrMus[selectedIdx] != undefined}
					<FormInstrumentoMusica bind:data={instrMus[selectedIdx]} layout="sm" defaultEdit={false} singleCol borderless />
					<div class="w-full border-b my-4 border-neutral" ></div>
					<FormInstrumento bind:data={instrMus[selectedIdx].instrumento} layout="sm" defaultEdit={false} singleCol borderless 
					on:blur={blurInstrumento} />
				{:else}
					<div class="flex flex-col h-full overflow-y-auto overflow-x-hidden"> 

						<div class="form-layout single-grid-col ">
							<Input label="Largura" name="largura" type="number" size="sm" bind:value={width} {url} required/>
							<Input label="Altura" name="altura" type="number" size="sm" bind:value={height} {url} required/>
							<Input label="Espaçamento Linhas" name="linhas" type="number" size="sm" bind:value={espaco} {url} required/>
						</div>
						<div class="mt-4 border-t border-neutral h-full overflow-y-auto overflow-x-hidden flex flex-col" >
							<div class="h-full overflow-y-auto flex flex-col overflow-x-hidden">
								<div class="border-b border-neutral w-full" >
									<div class="flex flex-row " class:hidden={insEdit || insCreate}>
										<label class="flex flex-row grow min-w-0 items-center overflow-hidden" title="Pesquisar" >
											<input type="text" class="bg-transparent outline-none pl-4 py-2 grow z-10 min-w-0"  placeholder="Instrumentos" bind:value={searchInst}>
											<Search className="h-4 w-4 m-2 opacity-70 flex-none"/>
										</label>
										<button class="btn-ghost bg-base-300 flex-none px-2" title="Adicionar" on:click={()=>{
											ceInstrumento = new Instrumento({})
											insCreate = true
										}}>
											<Plus className="w-[16px]"/>	
										</button>
									</div>
									<div class="flex flex-row" class:hidden={!(insEdit || insCreate)}>
										<label class="flex flex-row grow min-w-0 items-center overflow-hidden" title="Pesquisar" >
											<input type="text" class="bg-transparent outline-none pl-4 py-2 grow z-10 min-w-0" disabled placeholder="Instrumentos">
										</label>
										<button class="btn-ghost bg-success hover:bg-success flex-none px-2" class:hidden={!insCreate} title="Adicionar" 
										on:click={()=>{
											if (!instForm.reportValidity()) return 
											instForm.requestSubmit();
										}}>
											<Check className="w-[16px] btn-success "/>	
										</button>
										<button class="btn-ghost bg-base-300 flex-none px-2" title="Voltar" on:click={()=>{

											if (insEdit && !instForm.reportValidity()) return 
											console.log(ceInstrumento)
											instrumentos = instrumentos
											insCreate = false
											insEdit = false
										}}>
											<ArrowLeft className="w-[16px] "/>	
										</button>
										
									</div>
								</div>
								<div class="overflow-y-auto overflow-x-hidden w-full flex flex-col" class:hidden={(insEdit || insCreate)}>
									{#each filteredInst as ins}
										<div class="overflow-x-hidden w-full flex flex-row flex-none">
											<button data-index={ins.id} draggable="true" class="flex h-20 btn-ghost border-none bg-base-200 flex-grow min-w-0" title={ins.nome} on:click={()=>{
												pushInstrumento(instrumentos.find((x) => x.nome == ins.nome), 
													posLimit(-frame.posX, width-ins.tamanhoX/frame.zoom), 
													posLimit(-frame.posY, height-ins.tamanhoY/frame.zoom)
												)
											}} 
												on:dragstart={(e)=>e.dataTransfer?.setData("target", ins.nome)}>
												<div class="w-20 min-w-0 p-1" draggable="false">
													<img class="max-w-full max-h-full m-auto" src={ins._imagem} alt={ins.nome}/>
												</div>
												<div draggable="false" class=" my-auto truncate p-2">{ins.nome}</div>
											</button>
											<button data-index={ins.id} draggable="false" class="flex h-20 px-1 btn-ghost bg-base-200 items-center flex-none" title="Editar" on:click={()=>{
												ceInstrumento = ins
												oldCeInstrumento = new Instrumento(ins)
												insEdit = true
											}}>
												<Edit />
											</button>
										</div>
									{/each}
								</div>
								<div class="flex flex-col h-full overflow-y-auto overflow-x-hidden relative" class:hidden={!(insEdit || insCreate)}> 
									<FormInstrumento bind:form={instForm} bind:data={ceInstrumento} layout="sm" singleCol defaultEdit={false} borderless
									alwaysWrite
									on:blur={blurInstrumento}
									on:changeimage={() => {
										instrMus = instrMus
									}}
									on:success={() => {
										ceInstrumento._imagem = URL.createObjectURL(ceInstrumento.files[0])
										instrumentos.push(ceInstrumento);
										instrumentos = instrumentos
										insCreate = false
									}} />
									
								</div>
							</div>
						</div>

					</div>

				{/if}	
			</div>	
		</div>
		<div role="button" tabindex="0" class="absolute top-0 left-0 h-full bg-neutral cursor-ew-resize w-[2px]
		hover:w-[3px] hover:bg-primary active:w-[3px] active:bg-primary transition-all z-20" 
		on:mousedown={(e)=>onDragStart(e, 'menu2', 'width')} on:touchstart={(e)=>onDragStart(e, 'menu2', 'width')}>
		</div>
	</menu>
	{/if}
</div>