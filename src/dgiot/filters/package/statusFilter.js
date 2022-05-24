export default function statusFilter(status) {
  const statusMap = {
    published: 'success',
    draft: 'gray',
    deleted: 'danger',
  }
  return statusMap[status]
}
