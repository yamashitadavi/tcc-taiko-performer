<script lang="ts">
	import MapaPalco from './../../components/base/mapaPalco.svelte';
	import Body from './../../components/base/body.svelte';
	import FormMusica from '../../components/forms/formMusica.svelte';
	import Card from '../../components/base/card.svelte';

	import {request_url} from '../../config.json' 
	import { deleteRowTable, upsertTable } from '../../functions/request';
	import { renameFile, showError } from '../../functions/utils';
	import { Instrumento, InstrumentoMusica, Musica } from '../../components/classes/classes';
	import MusicaAprendida from '../../components/base/musicaAprendida.svelte';
	
	export let data : any 

	console.log(data)
	let writing : boolean,
	loading : boolean,
	reloadTocador : any,

	instrumentoInstance : any = {}

	function loadInstance() {
		instrumentoInstance = {}
		data.response.instrumentos.forEach((e : any) => {
			e._imagem = `${request_url}/instrumentos/icone/${e.id}.${e.tipoImagem || 'png'}` 
			instrumentoInstance[e.id] = e
			console.log('instrumento', e)
		});

		data.response.instrumentosMusica.forEach((im : any) => {
			const iId = im.instrumentoId;
			console.log('iId', iId)
			console.log('im', im)
			if (iId) {
				const ins = instrumentoInstance[iId]
				console.log('ins', ins)
				if (ins) {
					im.instrumento = ins
					return
				}
				instrumentoInstance[iId] = im.instrumento
				
			}
		});
		dataPalco = data.response.instrumentosMusica.map((e : any) => new InstrumentoMusica(e)),
		dataInstrumento = Object.values(instrumentoInstance),
		musica = new Musica(data.response.musica),
		toDelete = []
	}


	let dataPalco : any,
	dataInstrumento : any,
	musica : any,
	tocadorInstrumento : any = data.response.tocadorInstrumento,
	toDelete : any
	loadInstance();

	function onCancel() {
		loadInstance();
	}

	function onSuccess(e : any) {
		loading = true
		console.log('success')

		Promise.all(dataInstrumento.map((ins : any) => {
			let newIn = {...ins.toDb()}
			delete newIn.files
			return upsertTable('/instrumentos', newIn, fetch, newIn.id)
		})).then(lis => {
			let fileCall : any = []

			lis.forEach((ins, i) => {
				if (!ins.ok) throw ins
				let dtIns = dataInstrumento[i];

				if (dtIns.files) {
					console.log(ins.body)
					dtIns.files = renameFile(dtIns.files, ins.body.id+'.'+dtIns.files[0].name.split('.').pop());
				
					let dbIns = new Instrumento(dtIns)
					delete dbIns._imagem
					fileCall.push(upsertTable('/instrumentos/icone', dbIns.toFormData(), fetch))
				}
				dtIns.id = ins.body.id
			})
			Promise.all([
				...dataPalco.map((inMu: any) => upsertTable('/instrumento-musica', inMu.toDb(), fetch, inMu.id)),
				...toDelete.map((inMu: any) => deleteRowTable('/instrumento-musica', fetch, inMu.id)),
				...fileCall
			]).then((res) => {
				res.forEach((ins : any, idx : any) => {
					if (!ins.ok) {
						showError('Erro', ins.message)
						writing = true
						return
					}
					if (ins.body?.id && idx < dataPalco.length) {
						dataPalco[idx].id = ins.body.id
					}
				});
				toDelete = []
				data.response.instrumentosMusica = dataPalco
				data.response.instrumentos = dataInstrumento
				data.response.musica = musica

			}).finally(()=> {
				console.log('rodado', dataPalco)
				dataPalco = dataPalco
				reloadTocador()
				loading = false
			})

		}).catch(e => {
			showError('Erro', e.message)
			writing = true
			loading = false
			return
		})

	}
</script>
<Body>
	<FormMusica bind:loading={loading} data={musica} bind:writing={writing} on:success={onSuccess} on:cancel={onCancel}>
		<div class="w-full h-full p-2 md:p-4 ">
			<Card className="w-full h-full card-no-actions">
				<MapaPalco bind:instrMus={dataPalco} bind:instrumentos={dataInstrumento} bind:toDelete={toDelete} 
				bind:width={musica.largura} bind:height={musica.altura} bind:espaco={musica.linhas} 
				musicaId={musica.id} editing={writing}/>
			</Card>
		</div>
		<div class="w-full h-full p-2 md:p-4 " >
			<Card className="w-full h-full card-no-actions relative">
				<MusicaAprendida musicaId={data.response.musica.id} bind:instrMus={dataPalco} bind:tocadorInstr={tocadorInstrumento} bind:reloadTocador={reloadTocador} disabled={writing}/>
			</Card>
		</div>
	</FormMusica>
</Body>
