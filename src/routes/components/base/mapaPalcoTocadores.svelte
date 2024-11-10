<script lang="ts">

	import { InstrumentoMusica, MusicaApresentacao, TocadorMusica } from '../classes/classes';

	import { onMount } from 'svelte';
	import SearchDropdown from './searchDropdown.svelte';
	import X from '../icons/x.svelte';
	import { getTable } from '../../functions/request';
	import { request_url } from '../../config.json'
	import { showToast } from '../../functions/utils';
	import { ToastType } from '../enums/Enums';

	export let editing : any = false
	export let apresentacao : any = {}
	export let tocadores : any = []
	export let loading : boolean
	export let musApreJunct : any = [] 
	export let toDelete : any = {}

	console.log('musApreJunct', JSON.stringify(musApreJunct))

	let mapTocadores : any = {},
	
	instrMus : Array<InstrumentoMusica> = []

	let offsetX : any, offsetY: any,
	dKeyX : any, dKeyY : any,
	dragging : any,
	targetSize = { eW: 0, eH: 0 },
	frame : any = { posX: 0, posY: 0, zoom: 1.0 },
	width = 0, height = 0, espaco = 0,
	svg : any, container : any

	const menu1 : any = { width: document.body.clientWidth/7 },
	menu2 : any = { width: document.body.clientWidth/7 };
	
	let musicaSearch : any,
	musicaAddDisabled : boolean,
	clearMusicaVal : Function,
	draggingIndex : any,
	selectedMusica : any,
	tocadorSearch : any,
	clearTocadorVal : Function,
	selectedInstrumento : any = undefined,
	tocadorSearchSelection : any,
	tocadorHide : any = []

	$: updateTocadorInfo(tocadores)

	function updateTocadorInfo(tocadores : any) {
		console.log('--updateTocadorInfo')
		let hasTocador;
		mapTocadores = {}
		tocadores.forEach((e : any) => {
			mapTocadores[e.id] = e;
			if (tocadorSearch?.value == e.id) hasTocador = true;
		});
		mapTocadores = mapTocadores
		if (!hasTocador) tocadorSearch = { label: tocadorSearchSelection = '', value: '' }
		let hasUpdate
		for (let mu of musApreJunct) {
			for (let insId in mu.tocadores) {
				const toc = mu.tocadores[insId]
				if (toc && !mapTocadores[toc.tocadorId]) {
					hasUpdate = true
					delete mu.tocadores[insId] ;//wrong
				}
			}
		}

		if (hasUpdate) musApreJunct = musApreJunct
		

	}

	$: selectedJunct = musApreJunct[selectedMusica]

	$: (()=>{
		if (selectedJunct) {
			const k = (selectedJunct.tocadores[selectedJunct.instrumentos[selectedInstrumento ?? '']] ?? {tocador: {}})
			tocadorSearch = { label: k.nome, value: k.id, ...k}
		}
	})()


	onMount(loadScreenSize)
	
	function loadScreenSize() {

		if (!(+width && +height)) {
			width = 1280
			height = 720
			!espaco && (espaco = 100)
		} 

		const containerSize = container.getBoundingClientRect()

		if (containerSize.width < width || containerSize.height < height) {
			frame = {
				zoom: Math.min(
					containerSize.width / width,
					containerSize.height / height
				),
				posX: (containerSize.width-(width*frame.zoom))/2,
				posY: (containerSize.height-(height*frame.zoom))/2
			}
		}

	}

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

			const { width : eW, height : eH } = e.target.getBoundingClientRect()
			targetSize = { eW, eH }
		}

		dKeyX = keyX
		dKeyY = keyY

		dragging = idx

		if (type) 
			selectedInstrumento = idx

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
			} 
		}	

		if (dKeyX) {
			const cx = (e.clientX ?? e.touches[0].clientX)/scaleFactor
			let x = cx - offsetX
			if (dragging == 'menu1') menu1[dKeyX] = x
			else if (dragging =='menu2') {
				menu2[dKeyX] = menu2[dKeyX] + (offsetX - cx)
				offsetX = cx
			} else if (dragging == 'frame') {
				frame.posX = x
			} 
			
		}
	}	

	function onDragEnd(e : any) {
		dragging = undefined
	}
	

	async function addMusica() {
		musicaAddDisabled = true;

		let mus = {...musicaSearch}
		delete mus.label
		delete mus.value

		console.log('musicaSearch', JSON.stringify(musicaSearch))

		let inMu = (await getTable('/instrumento-musica', {
			include: [ "instrumento" ],
			where: { musicaId: musicaSearch.id }
		}, fetch)).response.map((e : any) => {
			let newins = new InstrumentoMusica(e)
			if (newins.instrumento) newins.instrumento._imagem = `${request_url}/instrumentos/icone/${newins.instrumento.id}.${newins.instrumento.tipoImagem || 'png'}`
			return newins
		});

		musApreJunct.push({
			musicaApre: new MusicaApresentacao({ musica: mus, musicaId: mus.id, apresentacaoId: apresentacao.id, ordem: 0 }), //TODO: select music from dropdown
            tocadores: {},
            instrumentos: inMu
		})
		clearMusicaVal()

		musApreJunct = musApreJunct

		musicaAddDisabled = false;
	}

	function removeMusica(idx : any) {
        if (idx === undefined) return
		//delete from musApreJunct
		let toDel = musApreJunct.splice(idx, 1)[0]
		console.log(toDel)
		if (toDel.musicaApre.id !== undefined) toDelete[toDel.musicaApre.id] = toDel

		musApreJunct = musApreJunct;
		if (selectedMusica == idx) selectedMusica = undefined
    }

	function dataTransfer(e : any, idx : any) {
		draggingIndex = idx;
		e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', idx);
	}
			
	function dropMusica(idx : any) {
		if (draggingIndex === null) return;

		const draggedItem = musApreJunct[draggingIndex];
		musApreJunct = musApreJunct.filter((e : any, i : any) => i !== draggingIndex); 
		musApreJunct.splice(idx, 0, draggedItem);

		if (idx == selectedMusica || draggingIndex > selectedMusica)
		selectedMusica = selectedMusica+1

		draggingIndex = null;
	}		

	function setTocador(e : any) {
		const tocs = musApreJunct[selectedMusica].tocadores, 
		instrumentoId = musApreJunct[selectedMusica].instrumentos[selectedInstrumento].id

		for (let insId in tocs) {
			if (tocs[insId].tocadorId == e.detail.value.id) {
				delete musApreJunct[selectedMusica].tocadores[insId];
			}
		}

		musApreJunct[selectedMusica].tocadores[instrumentoId] =
		new TocadorMusica({ musicaApresentacaoId: musApreJunct[selectedMusica].musicaApre.id, instrumentoMusicaId: instrumentoId, tocadorId: e.detail.value.id, tocador: mapTocadores[e.detail.value.id] });

		musApreJunct = musApreJunct
		
	}

	function removeTocador(insId : any, idx : any) {

		if (selectedJunct.tocadores[insId]?.id) {
			if (!selectedJunct.toDelete) selectedJunct.toDelete = []
			selectedJunct.toDelete.push(selectedJunct.tocadores[insId]) 
		}

		if (selectedInstrumento == idx) {
			tocadorSearch = { label: tocadorSearchSelection = '', value: '' }
		}

		delete selectedJunct.tocadores[insId]
		musApreJunct = musApreJunct
	}

	async function autoselectTocadores() {
		loading = true
		let allTocs = Object.keys(mapTocadores),
		notQry : any = [], condition;


		selectedJunct.instrumentos.forEach((ins : any) => {
			console.log('ins', ins)
			const toc = selectedJunct.tocadores[ins.insturmentoId];

			if (toc) {
				notQry.push(toc.tocadorId)
			} else {
				condition = true
			}
		})

		if (condition) {
			const { response, ok } = await getTable('/musica-aprendida', {
				where: { musicaId: selectedJunct.musicaApre.musicaId, tocadorId: { inq: allTocs.reduce((acc : any, v : any) => {
					if (!notQry.includes(v)) acc.push(v)
					return acc;
				}, [])} }
			}, fetch)

			if (!ok) return loading = false;

			console.log('response', response)

			let [ instrXtoc, mapCount ] = response.reduce(([acc, counter] : any, v : any) => {
				if (!acc[v.instrumentoMusicaId]) acc[v.instrumentoMusicaId] = []
				acc[v.instrumentoMusicaId].push(v)
				counter[v.instrumentoMusicaId] = (counter[v.instrumentoMusicaId] ?? 0) + 1
				return [acc, counter]
			}, [{},{}])

			let order = Object.entries(mapCount).sort((a : any, b : any) => {
				return a[1] - b[1]
			}).map((e : any) => e[0])

			console.log('order', order)
			
			let selected : any = [];

			order.forEach((insMId : any) => {
                for (let k of instrXtoc[insMId]) {
					if (!selected.includes(k.tocadorId)) {
						selected.push(k.tocadorId);
						musApreJunct[selectedMusica].tocadores[insMId] = 
						new TocadorMusica({ musicaApresentacaoId: musApreJunct[selectedMusica].musicaApre.id, instrumentoMusicaId: +insMId, tocadorId: k.tocadorId, tocador: mapTocadores[k.tocadorId] })
                        break;
					}
				}
            })

		}
		showToast('Seleção automática', 'Realizado com sucesso', ToastType.success)
		loading = false
	}

	function loadTocadorInfo(ins : any) {
		
		const { tocador } = musApreJunct[selectedMusica].tocadores[ins.id] ?? {}
		if (tocador) {
			tocadorSearch = { label: tocador.nome, value: tocador.id, ...tocador }
			tocadorSearchSelection = tocadorSearch.label
			tocadorHide = [ tocador.id ]
			return
		}
		tocadorSearch = { label: '', value: '' } 
		tocadorSearchSelection = ''
		tocadorHide = []
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

<div role="cell" tabindex="0" class="h-full w-full outline-none flex palco-tocador" on:mouseup={onDragEnd} on:touchend={onDragEnd}
on:mouseleave={onDragEnd} on:touchcancel={onDragEnd} on:mousemove={onDrag} on:touchmove={onDrag}
on:keyup={(e)=>{ if (e.key == 'Enter') selectedInstrumento = undefined}}>

	<menu class="h-full flex relative select-none flex-col overflow-auto bg-base-200" style:width={menu1.width+'px'}>
		<div class="form-control h-full max-h-full w-full max-w-full p-0 py-2">
			<div class="form-control flex-shrink-0 grow-0 px-2 gap-4" class:hidden={!editing}>
				<SearchDropdown size="sm" label="Música" className="w-full" url="/musicas" additionalFields={{
					tempo: true, layoutX: true, layoutY: true, espaco: true
				}} bind:value={musicaSearch} bind:clearValue={clearMusicaVal} />
				<button class="btn btn-primary btn-sm truncate" on:click={addMusica} disabled={musicaAddDisabled || !musicaSearch?.value}>Adicionar</button>
			</div>
			<div class="grow flex flex-col max-h-full h-full rounded-none overflow-auto py-2">
				{#each musApreJunct as msc, i}
				<div role="button" tabindex="0" class="flex flex-row w-full min-h-[28px] {i == selectedMusica ? 'bg-base-content bg-opacity-15' : ''}"  draggable="true" 
					on:dragover|preventDefault on:dragstart={(e)=>dataTransfer(e, i)} 
					on:drop|preventDefault={()=>dropMusica(i)}>
					<button class="btn-sidemenu w-auto flex-none" class:hidden={!editing} title="Deletar" on:click|stopPropagation={()=>{removeMusica(i)}}><X className="text-red-400"></X></button>
					<button class="btn-sidemenu w-full px-1" title="Selecionar" on:click|stopPropagation={()=>{
						
						const { width : wd = 0, height : hi = 0, espaco : es = 0 } = (musApreJunct[selectedMusica = i]?.musicaApre ?? {}).musica ?? {};
						if (wd) width = wd
						if (hi) height = hi
						if (es) espaco = es
						loadScreenSize();
						selectedInstrumento = undefined
					}}>{msc.musicaApre.musica?.nome}</button>
				</div>
				{/each}
			</div>
			<div class="form-control flex-shrink-0 grow-0 px-2 gap-4" >
				Tempo: {musApreJunct.reduce((ac,e)=>ac+e.musicaApre.musica.tempo,0) ?? 0}m
			</div>
		</div>
		<div role="button" tabindex="0" class="absolute top-0 right-0 h-full bg-neutral cursor-ew-resize w-[2px] z-20
		hover:w-[3px] hover:bg-primary active:w-[3px] active:bg-primary transition-all " on:mousedown={(e)=>onDragStart(e, 'menu1', 'width')} on:touchstart={(e)=>onDragStart(e, 'menu1', 'width')}>
		</div>
	</menu>
	
	<!-- Editor -->
	<div role="cell" tabindex="0" class="overflow-hidden flex-1 min-w-[40%] outline-none transparent-scrollbar p-20 relative touch-none" 
	class:cursor-grabbing={dragging == 'frame'}
	bind:this={container}
	data-editing={editing}
	on:mousedown={(e)=>onDragStart(e, 'frame')} on:touchstart={(e)=>onDragStart(e, 'frame')} 
	on:dragover|preventDefault
	on:click={()=> selectedInstrumento = undefined} on:keyup={(e)=>{}} 		
	>
		<svg role="cell" tabindex="0" 
		bind:this={svg} on:wheel={(e)=>{
			const wx = frame.zoom - (e.deltaY/1000)
			if (wx > 0.2 && wx < 1.2){
				frame.zoom = wx
				e.preventDefault()
			}
		}}


		class="border border-base-content outline-none absolute " 

		style:left={frame.posX}
		style:top={frame.posY}

		style="box-shadow: 0 0 2em rgba(0,0,0,0.1); transform: scale({frame.zoom});"
		  {width} {height} xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="partern" width={espaco} height={espaco} patternUnits="userSpaceOnUse">
					<line x1={espaco} y1="0" x2={espaco} y2={espaco} class="stroke-base-content" stroke-width="1"/>
					<line x1="0" y1={espaco} x2={espaco} y2={espaco} class="stroke-base-content" stroke-width="1"/>
				</pattern>
			</defs>
			
			<rect width="100%" height="100%" fill="url(#partern)" />

			{#each musApreJunct[selectedMusica]?.instrumentos ?? [{}] as ins, i}
				<image role="button" tabindex="0" 
				xlink:href={(ins.instrumento ?? {})._imagem}
				x={ins.posX} y={ins.posY} width={ins.tamX} height={ins.tamY} class="bg-base-200 instrument " class:active={selectedInstrumento == i && ins.terTocador} class:hasTocador={ins.terTocador}
					on:click|stopPropagation={()=>{ selectedInstrumento = (ins.terTocador) ? i : undefined; 
					loadTocadorInfo(ins) }} 
					on:keydown|stopPropagation={(e)=>{ if (e.key == 'Enter') { selectedInstrumento = (ins.terTocador) ? i : undefined; 
					loadTocadorInfo(ins) }}} 
				/>
				<!--conferir-->
				{#if ins.terTocador}
				<foreignObject class="outline-none" width={ins.tamX} height="36" x={ins.posX} y={+ins.posY > 36 ? +ins.posY-36 : ins.posY} role="button" tabindex="-1" 
					on:click|stopPropagation={()=>{ selectedInstrumento = (ins.terTocador) ? i : undefined; 
					loadTocadorInfo(ins) }} 
					on:keydown|stopPropagation={(e)=>{ if (e.key == 'Enter') { selectedInstrumento = (ins.terTocador) ? i : undefined; 
					loadTocadorInfo(ins) }}} >
					<div title={(musApreJunct[selectedMusica].tocadores[ins.id] ?? {tocador: {}}).tocador.nome ?? ''}
					class="select-none bg-base-100 w-min truncate max-w-full m-auto px-2 py-1 rounded-md border-base-content border {musApreJunct[selectedMusica].tocadores[ins.id] == undefined ? 'border-red-300 text-red-300' : ''} ">
						{(musApreJunct[selectedMusica].tocadores[ins.id] ?? {tocador: {}}).tocador.nome ?? '<Selecionar>'}
					</div>
				</foreignObject>
				{/if}
			{/each}
		</svg>
	</div>

	<menu class="h-full flex relative select-none flex-col overflow-auto bg-base-200"  style:width={menu2.width+'px'} >
		<div class="form-control h-full max-h-full w-full max-w-full p-0 py-2">
			<div class="form-control flex-shrink-0 grow-0 px-2 gap-4" >
				<SearchDropdown size="sm" label="Tocador" className="w-full {selectedInstrumento != null ? '' : 'hidden'}" data={tocadores} 
				clearable bind:exclude={tocadorHide} bind:searchSelection={tocadorSearchSelection} disabled={!editing}
				bind:value={tocadorSearch} bind:clearValue={clearTocadorVal} on:select={setTocador} />
	
				<button class="btn btn-secondary btn-sm truncate" title="Selção automática de tocadores"
				class:hidden={selectedInstrumento !== undefined || selectedMusica === undefined || !editing} on:click={autoselectTocadores} disabled={musicaAddDisabled}>Seleção Automática</button>
			</div>
	
			<div class="grow flex flex-col max-h-full h-full rounded-none overflow-auto py-2">
				{#each musApreJunct[selectedMusica]?.instrumentos ?? [] as ins, i}
					{#if ins.terTocador}
					<div role="button" tabindex="0" class="flex flex-row w-full min-h-[28px] {i == selectedInstrumento ? 'bg-base-content bg-opacity-15' : ''}" >
						<button class="btn-sidemenu w-full px-1 flex flex-row gap-4 items-center" title={
							(musApreJunct[selectedMusica].tocadores[ins.id] ?? {}).tocador?.nome ?? 'Selecionar'
						} on:click|stopPropagation={()=>{
							selectedInstrumento = i;
							loadTocadorInfo(ins)
						}}>
							<span class="truncate" class:text-red-300={(musApreJunct[selectedMusica].tocadores[ins.id] ?? {}).tocador?.nome == undefined}>{ins.nome}</span>
	
						</button>
						<button class="btn-sidemenu w-auto flex-none" class:hidden={(musApreJunct[selectedMusica].tocadores[ins.id] ?? {}).tocador?.nome == undefined || !editing} title="Remover" on:click|stopPropagation={()=>{removeTocador(ins.id, i)}}><X className="text-red-400"></X></button>
					</div>
					{/if}
				{/each}
			</div>
		</div>
		
		<div role="button" tabindex="0" class="absolute top-0 left-0 h-full bg-neutral cursor-ew-resize w-[2px]
		hover:w-[3px] hover:bg-primary active:w-[3px] active:bg-primary transition-all z-20" 
		on:mousedown={(e)=>onDragStart(e, 'menu2', 'width')} on:touchstart={(e)=>onDragStart(e, 'menu2', 'width')}>
		</div>
	</menu>
	
</div>