export default { mounted(el, binding) { let timer; el.addEventListener(binding.arg||'click',()=>{ clearTimeout(timer); timer=setTimeout(()=>binding.value(),binding.value?.wait||300) }) } }
