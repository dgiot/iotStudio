const req = require.context('.', true, /\.svg$/)
requireAll = (requireContext) => {
  return requireContext.keys()
    .map(requireContext)
}
requireAll(req)
