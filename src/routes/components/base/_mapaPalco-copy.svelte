<script lang="ts">
    let offsetX : any, offsetY: any; // Variables to store mouse position relative to the element's position
  let isDragging = false; // Flag to indicate if the element is being dragged
  let jojo = false
  let menu1 = {width: 100, offsetX: 0}
  let menu2 = {width: 2, offsetX: 0}
  let rx = 0, ry = 0

  function onDragStart(e : any, jojs : any) {
      offsetX = e.clientX - rx;
      offsetY = e.clientY - ry;
      menu1.offsetX = e.clientX - menu1.width

      jojo = !!jojs
      isDragging = true
  }

  function onDrag(e : any) {
      if (!isDragging) return

      if (isDragging && !jojo) {
          rx = e.clientX - offsetX;
          ry = e.clientY - offsetY;
          return
      }
      menu1.width = e.clientX - menu1.offsetX

  }	

  function onDragEnd(e : any) {
      isDragging = false
      jojo = false
  }
</script>
<style>

</style>
<div role="cell" tabindex="0" class="h-full w-full outline-none flex " on:mouseup={onDragEnd} on:touchend={onDragEnd}
on:mouseleave={onDragEnd} on:mousemove={onDrag} on:touchmove={onDrag} on:touchcancel={onDragEnd} >
  <menu class="h-full flex relative select-none overflow-hidden" style:width={menu1.width+'px'} >
      <div>

      </div>
      <div role="button" tabindex="0" class="absolute top-0 right-0 h-full bg-neutral cursor-ew-resize w-[2px]
      hover:w-[2px] hover:bg-primary active:w-[2px] active:bg-primary transition-all " on:mousedown={(e)=>onDragStart(e,true)} on:touchstart={(e)=>onDragStart(e,true)}>
      </div>
  </menu>
  
  <div role="button" tabindex="0" class="overflow-auto flex-1 min-w-[40%] " on:keydown={(e)=>{
      console.log(e, e.ctrlKey,e.key)
      
      }}>
      <svg class="h-full p-2 " width="1600" xmlns="http://www.w3.org/2000/svg"  >
          <defs>
              <!-- pattern -->
              <pattern id="myPattern" width="100" height="100" patternUnits="userSpaceOnUse">
                  <line x1="100" y1="0" x2="100" y2="100" class="stroke-base-content" stroke-width="1"/>
                  <line x1="0" y1="100" x2="100" y2="100" class="stroke-base-content" stroke-width="1"/>
              </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#myPattern)" />
          <rect class="instrument" role="cell" tabindex="0" x={rx >0 ? rx : 0} y={ry} width="20" height="20" fill="red" on:mousedown={(e)=>onDragStart(e, false)}  on:touchstart={(e)=>onDragStart(e, false)} />
          <!-- -->
          <!--xlink:href="data:image/png;base64,-->
          <!-- {#each routes as {  } (route)}
          {/each} -->
      </svg>
  </div>
  
  <menu class="h-full flex relative select-none overflow-hidden " style:width={menu2.width+'px'} >
      <div>
          
      </div>

      <div role="button" tabindex="0" class="absolute top-0 left-0 h-full bg-neutral cursor-ew-resize w-[2px]
      hover:w-[2px] hover:bg-primary active:w-[2px] active:bg-primary transition-all " on:mousedown={(e)=>onDragStart(e, false)} on:touchstart={(e)=>onDragStart(e, false)}>
      </div>
  </menu>

</div>