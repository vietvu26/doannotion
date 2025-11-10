export default {
  notification: {
    ticket_create:
      'Giao dịch {{ticketName}} vừa được thêm mới vào hệ thống bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_update:
      'Giao dịch {{ticketName}} vừa được cập nhật thông tin bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_delete:
      'Giao dịch {{ticketName}} vừa được xóa khỏi hệ thống bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_cancel:
      'Giao dịch {{ticketName}} vừa bị hủy bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_require_confirm:
      'Công việc {{usertaskName}} của Giao dịch {{ticketName}} cần được duyệt vào lúc {{createdDate}}',
    ticket_confirm:
      'Công việc {{usertaskName}} của Giao dịch {{ticketName}} vừa được duyệt bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_reject:
      '{{createdBy}} đã từ chối duyệt Công việc {{usertaskName}} của Giao dịch {{ticketName}} vào lúc {{createdDate}} với lý do {{reason}}',
    ticket_require_review:
      'Công việc {{usertaskName}} của Giao dịch {{ticketName}} cần được xem xét vào lúc {{createdDate}}',
    ticket_review:
      'Công việc {{usertaskName}} của Giao dịch {{ticketName}} vừa được xem xét bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_review_reject:
      '{{createdBy}} đã từ chối xem xét Công việc {{usertaskName}} của Giao dịch {{ticketName}} vào lúc {{createdDate}} với lý do {{reason}}',
    ticket_assign_user:
      'Giao dịch {{ticketName}} đã được gán cho {{assigner}} bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_update_status:
      'Giao dịch {{ticketName}} đã được chuyển trạng thái {{status}} vào lúc {{createdDate}}',
    ticket_authorize:
      'Giao dịch {{ticketName}} đã được gán cho {{assigner}} xử lý bởi {{createdBy}} vào lúc {{createdDate}}',
    ticket_remind_workflow:
      'Còn {{remindTime}} để thực hiện Giao dịch {{ticketName}}',
    ticket_remind_usertask:
      'Còn {{remindTime}} để thực hiện công việc {{usertaskName}} của Giao dịch {{ticketName}}',
    ticket_remind_workflow_overdue_onetime:
      'Bạn chưa thực hiện Giao dịch {{ticketName}}. Giao dịch đã quá hạn {{overdueTime}}.',
    ticket_remind_usertask_overdue_onetime:
      'Bạn chưa thực hiện công việc {{usertaskName}} của Giao dịch {{ticketName}}. Công việc đã quá hạn {{overdueTime}}.',
    ticket_remind_workflow_overdue_period:
      '[Remind] Bạn chưa thực hiện Giao dịch {{ticketName}}. Giao dịch đã quá hạn {{overdueTime}}.',
    ticket_remind_usertask_overdue_period:
      '[Remind] Bạn chưa thực hiện công việc {{usertaskName}} của Giao dịch {{ticketName}}. Công việc đã quá hạn {{overdueTime}}.',
    ticket_tag_comment:
      '[Thảo luận] Bạn vừa được tag vào bình luận của Giao dịch {{ticketName}} vào lúc {{createdDate}}',
    service_group_create:
      'Dịch vụ {{ticketName}} vừa được thêm mới vào hệ thống bởi {{createdBy}} vào lúc {{createdDate}}',
    service_group_update:
      'Dịch vụ {{ticketName}} vừa được chỉnh sửa bởi {{createdBy}} vào lúc {{createdDate}}',
    service_group_delete:
      'Dịch vụ {{ticketName}} vừa được xoá bởi {{createdBy}} vào lúc {{createdDate}}',
    send_from: {
      system: 'Hệ thống',
      e_account: 'eAccount',
      e_flow: 'eFlow',
      e_request: 'eRequest',
      e_id: 'eId',
      e_task: 'eTask',
      e_form: 'eForm',
      e_writer: 'eWriter',
      e_lms: 'eLMS',
      e_contract: 'eContract',
      e_catalogue: 'eCatalogue',
      e_wiki: 'eWiki',
    },
    filter: {
      all: 'Tất cả',
      read: 'Đã đọc',
      unread: 'Chưa đọc',
    },
  },
};
