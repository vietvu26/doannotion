export default {
  Notification: 'Thông báo',
  selectAuth: {
    all: 'All',
    allSub:
      'Can create tasks in the list, change list settings, and delete lists.',
    edit: 'Edit',
    editSub:
      'Can change list settings and edit tasks. Cannot delete lists, delete tasks, and add tasks.',
    read: 'Read only',
    readSub: 'Can only view tasks. Cannot perform other actions.',
    comment: 'Comment',
    commentSub:
      'Can comment and set status for tasks. Cannot change list settings.',
  },
  navbar: {
    kyta: 'Anh em KYTA',
    unread: 'Chưa đọc',
    read: 'Đã đọc',
    profile: {
      personal: 'Hồ sơ cá nhân',
      orginization: 'Hồ sơ doanh nghiệp',
      staff: 'Hồ sơ nhân viên',
      logout: 'Đăng xuất',
      'swap-orginization': 'Chuyển đổi tổ chức',
    },
    notify: {
      haveNotify: 'Bạn có thông báo mới',
      system: 'Hệ thống',
      title: 'Thông báo',
      noNotify: 'Không có thông báo',
      assign: {
        list: 'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> assign vào list công việc <span class="notify_item_title_name">{{ name }}</span>',
        listTooltip:
          'Bạn đã được {{ createdBy }} assign vào list công việc {{ name }}',
        task: 'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> assign vào công việc <span class="notify_item_title_name">{{ name }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span>',
        taskTooltip:
          'Bạn đã được {{ createdBy }} assign vào công việc {{ name }} thuộc list task {{ listTaskName }}',
        subTask:
          'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> assign vào task <span class="notify_item_title_name">{{ name }}</span>  là công việc con của <span class="notify_item_title_name">{{ taskName }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span>',
        subTaskTooltip:
          'Bạn đã được {{ createdBy }} assign vào task {{ name }}  là công việc con của {{ taskName }} thuộc list task {{ listTaskName }}',
        taskAssign:
          'Bạn có task <span class="notify_item_title_name">{{ name }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span> được assign bởi <span class="notify_item_title_name">{{ createdBy }}</span> sắp đến hạn sau <span class="notify_item_title_name">{{ time }}</span> nữa',
        taskAssignTooltip:
          'Bạn có task {{ name }} thuộc list task {{ listTaskName }} được assign bởi {{ createdBy }} sắp đến hạn sau {{ time }} nữa',
        subAssignTask:
          'Bạn có task <span class="notify_item_title_name">{{ name }}</span> là công việc con của <span class="notify_item_title_name">{{ taskName }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span> được assign bởi <span class="notify_item_title_name">{{ createdBy }}</span> sắp đến hạn sau <span class="notify_item_title_name">{{ time }}</span> nữa',
        subAssignTaskTooltip:
          'Bạn có task {{ name }} là công việc con của {{ taskName }} thuộc list task {{ listTaskName }} được assign bởi {{ createdBy }} sắp đến hạn sau {{ time }} nữa',
        haveTaskAssign:
          'Task <span class="notify_item_title_name">{{ name }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span> sắp đến hạn sau <span class="notify_item_title_name">{{ time }}</span> nữa',
        haveTaskAssignTooltip:
          'Task {{ name }} thuộc list task {{ listTaskName }} sắp đến hạn sau {{ time }} nữa',
        haveSubAssignTask:
          'Task <span class="notify_item_title_name">{{ name }}</span> là công việc con của <span class="notify_item_title_name">{{ taskName }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span> sắp đến hạn sau <span class="notify_item_title_name">{{ time }}</span> nữa',
        haveSubAssignTaskTooltip:
          'Task {{ name }} là công việc con của {{ taskName }} thuộc list task {{ listTaskName }} sắp đến hạn sau {{ time }} nữa',
        haveTagInComment:
          'Bạn được nhắc tới trong task <span class="notify_item_title_name">{{ name }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span>',
        haveTagInCommentTooltip:
          'Bạn được nhắc tới trong task {{ name }} thuộc list task {{ listTaskName }}',
        haveSubTagInComment:
          'Bạn được nhắc tới trong task <span class="notify_item_title_name">{{ name }}</span> là công việc con của <span class="notify_item_title_name">{{ taskName }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span>',
        haveSubTagInCommentTooltip:
          'Bạn được nhắc tới trong task {{ name }} là công việc con của {{ taskName }} thuộc list task {{ listTaskName }}',
      },
      acl: {
        list: 'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền vào list task <span class="notify_item_title_name">{{ name }}</span> với quyền <span class="notify_item_title_name">{{ aclName }}</span>',
        listTooltip:
          'Bạn đã được {{ createdBy }} phân quyền vào list task {{ name }} với quyền {{ aclName }}',
        templateList:
          'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền vào list template task <span class="notify_item_title_name">{{ name }}</span> với quyền <span class="notify_item_title_name">{{ aclName }}</span>',
        templateListTooltip:
          'Bạn đã được {{ createdBy }} phân quyền vào list template task {{ name }} với quyền {{ aclName }}',
        task: 'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền vào task <span class="notify_item_title_name">{{ name }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span> với quyền <span class="notify_item_title_name">{{ aclName }}</span>',
        taskTooltip:
          'Bạn đã được {{ createdBy }} phân quyền vào task {{ name }} thuộc list task {{ listTaskName }} với quyền {{ aclName }}',
        templateTask:
          'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền vào template task <span class="notify_item_title_name">{{ name }}</span> thuộc list template task <span class="notify_item_title_name">{{ listTaskName }}</span> với quyền <span class="notify_item_title_name">{{ aclName }}</span>',
        templateTaskTooltip:
          'Bạn đã được {{ createdBy }} phân quyền vào template task {{ name }} thuộc list template task {{ listTaskName }} với quyền {{ aclName }}',
        subTask:
          'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền vào task <span class="notify_item_title_name">{{ name }}</span> là công việc con của <span class="notify_item_title_name">{{ taskName }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span> với quyền <span class="notify_item_title_name">{{ aclName }}</span>',
        subTaskTooltip:
          'Bạn đã được {{ createdBy }} phân quyền vào task {{ name }} là công việc con của {{ taskName }} thuộc list task {{ listTaskName }} với quyền {{ aclName }}',
        subTemplateTask:
          'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền vào template task <span class="notify_item_title_name">{{ name }}</span> là công việc con của <span class="notify_item_title_name">{{ taskName }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span> với quyền <span class="notify_item_title_name">{{ aclName }}</span>',
        subTemplateTaskTooltip:
          'Bạn đã được {{ createdBy }} phân quyền vào template task {{ name }} là công việc con của {{ taskName }} thuộc list task {{ listTaskName }} với quyền {{ aclName }}',
      },
      review: {
        task: 'Bạn đã được <span class="notify_item_title_name">{{ createdBy }}</span> gán làm người phê duyệt task <span class="notify_item_title_name">{{ name }}</span> thuộc list task <span class="notify_item_title_name">{{ listTaskName }}</span>',
        taskTooltip:
          'Bạn đã được {{ createdBy }} gán làm người phê duyệt task {{ name }} thuộc list task {{ listTaskName }}',
        approved:
          'Task <span class="notify_item_title_name">{{ name }}</span> đang chờ bạn phê duyệt',
        approvedTooltip: 'Task {{ name }} đang chờ bạn phê duyệt',
      },
      '8-3-EVENTS':
        '🎉 <strong>Chúc mừng ngày 8/3!</strong> 🎉</p><p>Gửi đến các chị em <strong>BA, Tester &amp; đội triển khai</strong> – những người luôn tận tâm, sáng tạo và mạnh mẽ!&nbsp;</p><p>💐 Chúc các bạn luôn rạng rỡ, hạnh phúc và thành công!</p><p>🌸 <strong>Happy Women’s Day!</strong> 🌸</p>',
      ASSIGN_TASK_LIST_TO_ORG:
        'Phòng ban <span class="notify_item_title_name">{{ orgName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_TASK_LIST_TO_ORGTooltip:
        'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} gán vào không gian {{ listTaskName }}',
      ASSIGN_TASK_LIST_TO_GROUP:
        'Nhóm <span class="notify_item_title_name">{{ groupName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào không gian <span class="notify_item_title_name">{{listTaskName}}</span>',
      ASSIGN_TASK_LIST_TO_GROUPTooltip:
        'Nhóm {{ groupName }} của bạn đã được người dùng {{createdBy}} gán vào không gian {{listTaskName}}',
      LIST_OWNER_DELETED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã xóa không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      LIST_OWNER_DELETEDTooltip:
        'Người dùng {{ createdBy }} đã xóa không gian {{ listTaskName }}',
      LIST_OWNER_DELETED_TASK:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã xoá công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      LIST_OWNER_DELETED_TASKTooltip:
        'Người dùng {{ createdBy }} đã xoá công việc {{ name }} thuộc không gian {{ listTaskName }}',
      ASSIGN_TASK_LIST_TO_USER:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_TASK_LIST_TO_USERTooltip:
        'Bạn đã được người dùng {{ createdBy }} gán vào không gian {{ listTaskName }}',
      ASSIGN_TASK_TO_USER:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_TASK_TO_USERTooltip:
        'Bạn đã được người dùng {{ createdBy }} gán vào công việc {{ name }} thuộc không gian {{ listTaskName }}',
      ASSIGN_TASK_TO_GROUP:
        'Nhóm <span class="notify_item_title_name">{{ groupName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_TASK_TO_GROUPTooltip:
        'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc {{ name }} thuộc không gian {{ listTaskName }}',
      ASSIGN_TASK_TO_ORG:
        'Phòng ban <span class="notify_item_title_name">{{ orgName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_TASK_TO_ORGTooltip:
        'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc {{ name }} thuộc không gian {{ listTaskName }}',
      ASSIGN_SUBTASK_TO_USER:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào công việc con <span class="notify_item_title_name">{{ name }}</span> thuộc công việc <span class="notify_item_title_name">{{ taskName }}</span> của không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_SUBTASK_TO_USERTooltip:
        'Bạn đã được người dùng{{ createdBy }} gán vào công việc con {{ name }} thuộc công việc {{ taskName }} của không gian{{ listTaskName }}',
      ASSIGN_SUBTASK_TO_GROUP:
        'Nhóm <span class="notify_item_title_name">{{ groupName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào công việc con <span class="notify_item_title_name">{{ name }}</span> thuộc công việc <span class="notify_item_title_name">{{ taskName }}</span> của không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_SUBTASK_TO_GROUPTooltip:
        'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc con {{ name }} thuộc công việc {{ taskName }} của không gian {{ listTaskName }}',
      ASSIGN_SUBTASK_TO_ORG:
        'Phòng ban <span class="notify_item_title_name">{{ orgName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán vào công việc con <span class="notify_item_title_name">{{ name }}</span> thuộc công việc <span class="notify_item_title_name">{{ taskName }}</span> của không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_SUBTASK_TO_ORGTooltip:
        'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc con {{ name }} thuộc công việc {{ taskName }} của không gian {{ listTaskName }}',
      ASSIGN_USER_AS_TASK_APPROVED:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán là người phê duyệt công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_USER_AS_TASK_APPROVEDTooltip:
        'Bạn đã được người dùng {{ createdBy }} gán là người phê duyệt công việc {{ name }} thuộc không gian {{ listTaskName }}',
      TASK_NEEDS_APPROVED:
        'Công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span> vừa được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> chuyển sang trạng thái <span class="notify_item_title_name">Chờ phê duyệt</span>. Vui lòng truy cập và phê duyệt công việc.',
      TASK_NEEDS_APPROVEDTooltip:
        'Công việc {{ name }} thuộc không gian {{ listTaskName }} vừa được người dùng {{ createdBy }} chuyển sang trạng thái Chờ phê duyệt. Vui lòng truy cập và phê duyệt công việc.',
      TASK_APPROVED:
        'Công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span> đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phê duyệt sang trạng thái Hoàn thành.',
      TASK_APPROVEDTooltip:
        'Công việc {{ name }} thuộc không gian {{ listTaskName }} đã được người dùng {{ createdBy }} phê duyệt sang trạng thái Hoàn thành.',
      TASK_PENDING_APPROVED:
        'Công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span> đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> chuyển từ trạng thái <span class="notify_item_title_name">Chờ phê duyệt</span> về trạng thái <span class="notify_item_title_name">{{ newValue }}</span>',
      TASK_PENDING_APPROVEDTooltip:
        'Công việc {{ name }} thuộc không gian {{ listTaskName }} đã được người dùng {{ createdBy }} chuyển từ trạng thái Chờ phê duyệt về trạng thái {{ newValue }}',
      TASK_RATING_ADD:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã đánh giá {số sao} sao cho công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TASK_RATING_ADDTooltip:
        'Người dùng {{ createdBy }} đã đánh giá {số sao} sao cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
      TASK_COMMENT_ADD:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã thêm nhận xét cho công việc {{ name }} thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TASK_COMMENT_ADDTooltip:
        'Người dùng {{ createdBy }} đã thêm nhận xét cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
      TASK_RATING_UPDATED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã thay đổi đánh giá công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span> thành <span class="notify_item_title_name">{{ rating }}</span> sao',
      TASK_RATING_UPDATEDTooltip:
        'Người dùng {{ createdBy }} đã thay đổi đánh giá công việc {{ name }} thuộc không gian {{ listTaskName }} thành {{ rating }} sao',
      TASK_COMMENT_UPDATED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã thay đổi nhận xét cho công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TASK_COMMENT_UPDATEDTooltip:
        'Người dùng {{ createdBy }} đã thay đổi nhận xét cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
      ASSIGNEE_UPDATE_TASK_STATUS_IN_MY_LIST:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã cập nhật trạng thái công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span> từ <span class="notify_item_title_name">{{ oldValue }}</span> sang <span class="notify_item_title_name">{{ newValue }}</span>',
      ASSIGNEE_UPDATE_TASK_STATUS_IN_MY_LISTTooltip:
        'Người dùng {{ createdBy }} đã cập nhật trạng thái công việc {{ name }} thuộc không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
      TASK_REMINDER:
        'Bạn có công việc <span class="notify_item_title_name">{{ name }}</span> cần thực hiện vào <span class="notify_item_title_name">{{ dueDate }}</span>. Vui lòng hoàn thành trước thời gian đến hạn.',
      TASK_REMINDERTooltip:
        'Bạn có công việc {{ name }} cần thực hiện vào {{ dueDate }}. Vui lòng hoàn thành trước thời gian đến hạn.',
      TASK_REMINDER_NO_DATE:
        'Bạn có công việc <span class="notify_item_title_name">{{ name }}</span> cần thực hiện. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
      TASK_REMINDER_NO_DATETooltip:
        'Bạn có công việc {{ name }} cần thực hiện. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
      TASK_OVERDUE_REMINDER:
        'Công việc <span class="notify_item_title_name">{{ name }}</span> đã trễ hạn {thời gian trễ hạn}. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
      TASK_OVERDUE_REMINDERTooltip:
        'Công việc {{ name }} đã trễ hạn {thời gian trễ hạn}. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
      ASSIGN_USER_AS_COORDINATOR:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> gán là người điều phối không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_USER_AS_COORDINATORTooltip:
        'Bạn đã được người dùng {{ createdBy }} gán là người điều phối không gian {{ listTaskName }}',
      ASSIGN_USER_AS_COORDINATOR_OWNER:
        'Người dùng <span class="notify_item_title_name">{{ coordinator }}</span> vừa được người điều phối <span class="notify_item_title_name">{{ createdBy }}</span> thêm vào danh sách người điều phối không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      ASSIGN_USER_AS_COORDINATOR_OWNERTooltip:
        'Người dùng {{ createdBy }} vừa được người điều phối {{ coordinator }} thêm vào danh sách người điều phối không gian {{ listTaskName }}',
      REMOVE_TASK_LIST_COORDINATOR:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> vừa xoá bạn khỏi danh sách người điều phối không gian <span class="notify_item_title_name">{{ listTaskName }}<span>',
      REMOVE_TASK_LIST_COORDINATORTooltip:
        'Người dùng {{ createdBy }} vừa xoá bạn khỏi danh sách người điều phối không gian {{ listTaskName }}',
      REMOVE_TASK_LIST_COORDINATOR_OWNER:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> vừa xoá người dùng <span class="notify_item_title_name">{{ coordinator }}</span> khỏi danh sách người điều phối không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      REMOVE_TASK_LIST_COORDINATOR_OWNERTooltip:
        'Người dùng {{ createdBy }} vừa xoá người dùng {{ coordinator }} khỏi danh sách người điều phối không gian {{ listTaskName }}',
      SHARE_TASK_LIST_TO_USER:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TASK_LIST_TO_USERTooltip:
        'Bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian {{ listTaskName }}',
      SHARE_TASK_LIST_TO_GROUP:
        'Nhóm <span class="notify_item_title_name">{{ groupName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TASK_LIST_TO_GROUPTooltip:
        'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian {{ listTaskName }}',
      SHARE_TASK_LIST_TO_ORG:
        'Phòng ban <span class="notify_item_title_name">{{ orgName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TASK_LIST_TO_ORGTooltip:
        'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian {{ listTaskName }}',
      SHARE_TASK_TO_USER:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào mẫu công việc <span class="notify_item_title_name">{{ name }}</span> của không gian mẫu công việc <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TASK_TO_USERTooltip:
        'Bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào mẫu công việc {{ name }} của không gian mẫu công việc {{ listTaskName }}',
      SHARE_TASK_TO_GROUP:
        'Nhóm <span class="notify_item_title_name">{{ groupName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào mẫu công việc <span class="notify_item_title_name">{{ name }}</span> của không gian mẫu công việc <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TASK_TO_GROUPTooltip:
        'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào mẫu công việc {{ name }} của không gian mẫu công việc {{ listTaskName }}',
      SHARE_TASK_TO_ORG:
        'Phòng ban <span class="notify_item_title_name">{{ orgName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào công việc <span class="notify_item_title_name">{{ name }}</span> của không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TASK_TO_ORGTooltip:
        'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào công việc {{ name }} của không gian {{ listTaskName }}',
      SHARE_TEMPALTE_TASK_LIST_TO_USER:
        'Bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào không gian mẫu công việc <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TEMPALTE_TASK_LIST_TO_USERTooltip:
        'Bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian mẫu công việc {{ listTaskName }}',
      SHARE_TEMPALTE_TASK_LIST_TO_GROUP:
        'Nhóm <span class="notify_item_title_name">{{ groupName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào không gian mẫu công việc <span class="notify_item_title_name">{{ listTaskName }}</span>',
      SHARE_TEMPALTE_TASK_LIST_TO_GROUPTooltip:
        'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian mẫu công việc {{ listTaskName }}',
      SHARE_TEMPALTE_TASK_LIST_TO_ORG:
        'Phòng ban <span class="notify_item_title_name">{{ orgName }}</span> của bạn đã được người dùng <span class="notify_item_title_name">{{ createdBy }}</span> phân quyền <span class="notify_item_title_name">{{ aclName }}</span> vào template <span class="notify_item_title_name">{{ name }}</span>',
      SHARE_TEMPALTE_TASK_LIST_TO_ORGTooltip:
        'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào template {{ name }}',
      LIST_OWNER_INFO_UPDATED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã chỉnh sửa thông tin <span class="notify_item_title_name">{{ attr }}</span> cho không gian <span class="notify_item_title_name">{{ listTaskName }}</span> từ <span class="notify_item_title_name">{{ oldValue }}</span> sang <span class="notify_item_title_name">{{ newValue }}</span>',
      LIST_OWNER_INFO_UPDATEDTooltip:
        'Người dùng {{ createdBy }} đã chỉnh sửa thông tin {{ attr }} cho không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
      USER_ADD_INFO_TO_LIST:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> có quyền <span class="notify_item_title_name">{{ aclName }}</span> đã thêm thông tin <span class="notify_item_title_name">{{ attr }}</span> có giá trị <span class="notify_item_title_name">{{ newValue }}</span> cho không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      USER_ADD_INFO_TO_LISTTooltip:
        'Người dùng {{ createdBy }} có quyền {{ aclName }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho không gian {{ listTaskName }}',
      LIST_OWNER_ADD_INFO:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã thêm thông tin <span class="notify_item_title_name">{{ attr }}</span> có giá trị <span class="notify_item_title_name">{{ newValue }}</span> cho không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      LIST_OWNER_ADD_INFOTooltip:
        'Người dùng {{ createdBy }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho không gian {{ listTaskName }}',
      LIST_OWNER_UPDATED_TASK_INFO:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã chỉnh sửa thông tin <span class="notify_item_title_name">{{ attr }}</span> cho công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span> từ <span class="notify_item_title_name">{{ oldValue }}</span> sang <span class="notify_item_title_name">{{ newValue }}</span>',
      LIST_OWNER_UPDATED_TASK_INFOTooltip:
        'Người dùng {{ createdBy }} đã chỉnh sửa thông tin {{ attr }} cho công việc {{ name }} thuộc không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
      TASK_PERMISSION_DELETED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> có quyền <span class="notify_item_title_name">{{ aclName }}</span> đã xoá công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TASK_PERMISSION_DELETEDTooltip:
        'Người dùng {{ createdBy }} có quyền {{ aclName }} đã xoá công việc {{ name }} thuộc không gian {{ listTaskName }}',
      TASK_OWNER_ADD_INFO:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã thêm thông tin <span class="notify_item_title_name">{{ attr }}</span> có giá trị <span class="notify_item_title_name">{{ newValue }}</span> cho công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TASK_OWNER_ADD_INFOTooltip:
        'Người dùng {{ createdBy }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
      TASK_PERMISSION_UPDATED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> có quyền <span class="notify_item_title_name">{{ aclName }}</span> đã chỉnh sửa thông tin <span class="notify_item_title_name">{{ attr }}</span> cho công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span> từ <span class="notify_item_title_name">{{ oldValue }}</span> sang <span class="notify_item_title_name">{{ newValue }}</span>',
      TASK_PERMISSION_UPDATEDTooltip:
        'Người dùng {{ createdBy }} có quyền {{ aclName }} đã chỉnh sửa thông tin {{ attr }} cho công việc {{ name }} thuộc không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
      TASK_PERMISSION_ADD_INFO:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> có quyền <span class="notify_item_title_name">{{ aclName }}</span> đã thêm thông tin <span class="notify_item_title_name">{{ attr }}</span> có giá trị <span class="notify_item_title_name">{{ newValue }}</span> cho công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TASK_PERMISSION_ADD_INFOTooltip:
        'Người dùng {{ createdBy }} có quyền {{ aclName }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
      COORDINATOR_ADDED_NEW_TASK:
        'Người điều phối <span class="notify_item_title_name">{{ createdBy }}</span> vừa thêm công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      COORDINATOR_ADDED_NEW_TASKTooltip:
        'Người điều phối {{ createdBy }} vừa thêm công việc {{ name }} thuộc không gian {{ listTaskName }}',
      TEMPLATE_OWNER_UPDATED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã chỉnh sửa thông tin <span class="notify_item_title_name">{{ attr }}</span> cho template <span class="notify_item_title_name">{{ listTaskName }}</span> từ <span class="notify_item_title_name">{{ oldValue }}</span> sang <span class="notify_item_title_name">{{ newValue }}</span>',
      TEMPLATE_OWNER_UPDATEDTooltip:
        'Người dùng {{ createdBy }} đã chỉnh sửa thông tin {{ attr }} cho template {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
      TEMPLATE_OWNER_DELETED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã xoá template <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TEMPLATE_OWNER_DELETEDTooltip:
        'Người dùng {{ createdBy }} đã xoá template {{ listTaskName }}',
      TEMPLATE_OWNER_ADD_INFO:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> đã thêm thông tin <span class="notify_item_title_name">{{ attr }}</span> có giá trị <span class="notify_item_title_name">{{ newValue }}</span> cho template <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TEMPLATE_OWNER_ADD_INFOTooltip:
        'Người dùng {{ createdBy }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho template {{ listTaskName }}',
      TEMPLATE_PERMISSION_EDITED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> có quyền {{ aclName }} đã chỉnh sửa thông tin {{ attr }} cho template {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
      TEMPLATE_PERMISSION_EDITEDTooltip:
        'Người dùng {{ createdBy }} có quyền {{ aclName }} đã chỉnh sửa thông tin {{ attr }} cho template {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
      TEMPLATE_PERMISSION_DELETED:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> có quyền {{ aclName }} đã xoá template <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TEMPLATE_PERMISSION_DELETEDTooltip:
        'Người dùng {{ createdBy }} có quyền {{ aclName }} đã xoá template {{ listTaskName }}',
      TEMPLATE_PERMISSION_ADD_INFO:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> có quyền <span class="notify_item_title_name">{{ aclName }}</span> đã thêm thông tin <span class="notify_item_title_name">{{ attr }}</span> có giá trị <span class="notify_item_title_name">{{ newValue }}</span> cho template <span class="notify_item_title_name">{{ listTaskName }}</span>',
      TEMPLATE_PERMISSION_ADD_INFOTooltip:
        'Người dùng {{ createdBy }} có quyền {{ aclName }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho template {{ listTaskName }}',
      NOTIFY_COMMENT:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> vừa đề cập bạn trong công việc <span class="notify_item_title_name">{{ name }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      NOTIFY_COMMENTTooltip:
        'Người dùng {{ createdBy }} vừa đề cập bạn trong công việc {{ name }} thuộc không gian {{ listTaskName }}',
      NOTIFY_SUBTASK_COMMENT:
        'Người dùng <span class="notify_item_title_name">{{ createdBy }}</span> vừa đề cập bạn trong công việc con <span class="notify_item_title_name">{{ name }}</span> nằm trong công việc <span class="notify_item_title_name">{{ taskName }}</span> thuộc không gian <span class="notify_item_title_name">{{ listTaskName }}</span>',
      NOTIFY_SUBTASK_COMMENTTooltip:
        'Người dùng {{ createdBy }} vừa đề cập bạn trong công việc con {{ name }} nằm trong công việc {{ taskName }} thuộc không gian {{ listTaskName }}',
    },
    error: {
      mess1: 'Có lỗi xảy ra khi lấy danh sách thông báo',
    },
  },
  board: {
    to: 'đến',
    name: 'Tên',
    assignee: 'Người thực hiện',
    missDuration: 'Trễ hạn',
    expiredDate: 'Ngày hết hạn',
    latedDate: 'Trễ hạn',
    priority: 'Độ ưu tiên',
    noAssign: 'Chưa giao',
    totAss: 'Tổng số công việc theo người được giao',
    totNewAss: 'Tổng số công việc Mới theo người được giao',
    latedWeek: 'Công việc trễ hạn tuần này',
    titleD: {
      weekT: 'Công việc hoàn thành tuần này',
      weekL: 'Công việc hoàn thành tuần trước',
      today: 'Công việc hoàn thành hôm nay',
      yesterday: 'Công việc hoàn thành hôm qua',
      timeR:
        'Công việc hoàn thành trong khoảng thời gian {{ dateStart }} {{ to }} {{ dateEnd }}',
    },
    history: 'Hoạt động gần đây',
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    weekT: 'Tuần này',
    weekL: 'Tuần trước',
    timeR: 'Khoảng thời gian',
    sort: 'Sắp xếp',
    sortPri: 'Độ ưu tiên',
    sortLated: 'Thời gian trễ hạn',
    sortNear: 'Gần đến hạn',
    typeView: 'Dạng xem:',
    allDay: 'Cả ngày',
    'task-board': 'Task Boards',
    'task-list': 'Task List',
    placeholderDescription: 'Nhập mô tả',
    'search-input': 'Nhập tên công việc, nhãn',
    'status-name': 'Tên trạng thái',
    color: 'Màu sắc',
    'status-todo': 'Mới',
    'status-processing': 'Đang thực hiện',
    'status-approved': 'Chờ phê duyệt',
    'status-completed': 'Hoàn thành',
    'list-task': 'Không gian làm việc',
    'search-listtask-placeholder': 'Nhập tên không gian làm việc ...',
    'name-task': 'Tên công việc',
    addSubTask: 'Thêm công việc con',
    'update-subtask-status': 'Cập nhật trạng thái công việc con',
    'update-subtask-status-des':
      'Công việc "{{ name }}" có {{ count }} công việc con chưa hoàn thành. Bạn có muốn chuyển tất cả công việc sang trạng thái hoàn thành?',
    'update-task-status': 'Cập nhật trạng thái công việc',
    'update-task-status-des':
      'Tất cả công việc con của công việc "{{ name }}" đã hoàn thành. Bạn có muốn chuyển công việc sang trạng thái hoàn thành?',
    'task-count': 'Công việc',
    order: 'STT',
    'table-name': 'Tiêu đề',
    'table-tag': 'Nhãn',
    'table-created-date': 'Ngày tạo',
    'table-created-by': 'Người tạo:',
    'table-start-date': 'Ngày bắt đầu dự kiến',
    'table-due-date': 'Ngày kết thúc dự kiến',
    'table-overdue': 'Trễ hạn',
    'table-assignee': 'Người thực hiện',
    'table-subtask': 'Công việc con',
    'table-action': 'Hành động',
    button: {
      'create-task': 'Thêm mới công việc',
      'task-create': 'Thêm công việc',
      'create-status': '+ thêm trạng thái',
      filter: 'Bộ lọc ({{ count }})',
      'filter-0': 'Bộ lọc',
      save: 'Lưu',
      'change-name': 'Đổi tên',
      'copy-link': 'Sao chép liên kết',
      'add-task': 'Thêm mới công việc',
      clone: 'Nhân bản',
      delete: 'Xóa',
      'save-as-template': 'Lưu thành mẫu',
      share: 'Phân quyền',
      'change-status-name': 'Thay đổi tên trạng thái',
      'create-new-task': 'Tạo mới công việc',
      'minimum-column': 'Thu gọn cột',
      agree: 'Đồng ý',
      cancel: 'Hủy',
    },
    message: {
      'create-status-success': 'Thêm trạng thái thành công',
      'create-status-error': 'Thêm trạng thái không thành công',
      'update-status-name-success': 'Đổi tên trạng thái thành công',
      'update-status-name-error': 'Đổi tên trạng thái không thành công',
      'del-status-success': 'Xóa trạng thái thành công',
      'del-status-error': 'Xóa trạng thái không thành công',
      'change-task-status-success': 'Đổi trạng thái công việc thành công',
      'change-task-status-error': 'Đổi trạng thái công việc không thành công',
      'update-priority-success': 'Cập nhật độ ưu tiên thành công',
      'update-priority-error': 'Cập nhật độ ưu tiên thành công',
      'update-date-success': 'Cập nhật ngày thực hiện thành công',
      'update-date-error': 'Cập nhật ngày thực hiện không thành công',
      'get-list-task-error':
        'Lấy danh sách công việc không thành công hoặc danh sách công việc không tồn tại',
      'minimize-success-open': 'Mở thành công',
      'minimize-success-close': 'Thu gọn thành công',
      'minimize-error-open': 'Mở không thành công',
      'minimize-error-close': 'Thu gọn không thành công',
      'update-all-subtask-status-success':
        'Cập nhật trạng thái các công việc con thành công',
      'update-all-subtask-status-error':
        'Cập nhật trạng thái các công việc con không thành công',
      getAssigneeError:
        'Có lỗi xảy ra khi lấy danh sánh người thực hiện cho công việc',
      getInfoError: 'Có lỗi xảy ra khi lấy thông tin không gian làm việc',
      updateAssigneeSuccess: 'Cập nhật người thực hiện thành công',
      updateAssigneeError: 'Cập nhật người thực hiện thất bại',
      getSubtaskError: 'Có lỗi xảy ra khi lấy danh sách công việc con',
      reNameListSuccess: 'Đổi tên không gian thành công',
      reNameListError: 'Đổi tên không gian thất bại',
      duplicateListSuccess: 'Nhân bản không gian của tôi thành công',
      duplicateListError: 'Nhân bản không gian của tôi thất bại',
      deleteTaskError: 'Có lỗi xảy ra khi xóa task',
      createTaskError: 'Có lỗi xảy ra khi tạo task',
      getTaskError: 'Có lỗi xảy ra khi lấy thông tin task',
    },
    notify: {
      updateSubTask: {
        title: 'Cập nhật trạng thái công việc con',
        message:
          'Công việc "{{ name }}" có công việc con chưa hoàn thành. Bạn có muốn chuyển tất cả công việc con sang trạng thái hoàn thành?',
        buttonCancel: 'Giữ nguyên trạng thái',
        buttonSubmit: 'Chuyển sang hoàn thành',
      },
      updateTask: {
        title: 'Cập nhật trạng thái task',
        message:
          'Tất cả công việc con của công việc "{{ name }}" đã hoàn thành. Bạn có muốn chuyển công việc sang trạng thái hoàn thành?',
        message2:
          'Tất cả công việc con của công việc "{{ name }}" đã hoàn thành. Bạn có muốn chuyển công việc sang trạng thái chờ phê duyệt để người phê duyệt xem xét?',
        buttonCancel: 'Hủy',
        buttonSubmit: 'Đồng ý',
      },
      deleteListTask: {
        title: 'Xóa không gian?',
        message: 'Bạn có chắc chắn muốn xóa không gian "{{ name }}"?',
        buttonCancel: 'Giữ lại',
        buttonSubmit: 'Xóa',
      },
      updateAssignee: {
        title: 'Xóa assignee?',
        message:
          'Bạn có chắc chắn muốn xóa người thực hiện?. Khi xóa người thực hiện ở không gian sẽ xóa người thực hiện tương ứng ở các công việc đã giao',
      },
    },
    filter: {
      title: 'Bộ lọc nâng cao',
      status: 'Trạng thái',
      placeholderStatus: 'Chọn trạng thái',
      assignee: 'Người thực hiện',
      placeholderAssignee: 'Chọn người thực hiện',
      createdDate: 'Ngày tạo',
      fromDate: 'Từ ngày',
      toDate: 'Đến ngày',
      priority: 'Độ ưu tiên',
      placeholderPriority: 'Chọn độ ưu tiên',
      startExpect: 'Ngày bắt đầu dự kiến',
      endExpect: 'Ngày kết thúc dự kiến',
      processDate: 'Thời gian thực hiện',
    },
  },
  task: {
    history: {
      ADD_TSK:
        '<span class="history_bold">{{ createdBy }}</span> created the task <span class="history_bold">{{ name }}</span>',
      ADD_ATT:
        '<span class="history_bold">{{ createdBy }}</span> added a new attachment to the task <span class="history_bold">{{ name }}</span>',
      ADD_SUB:
        '<span class="history_bold">{{ createdBy }}</span> added a new sub-task <span class="history_bold">{{ name }}</span>',
      ADD_CHL:
        '<span class="history_bold">{{ createdBy }}</span> added a new to-do <span class="history_bold">{{ name }}</span>',
      UPD_TSK:
        '<span class="history_bold">{{ createdBy }}</span> edited the task <span class="history_bold">{{ name }}</span>',
      UPD_SUB:
        '<span class="history_bold">{{ createdBy }}</span> edited the subtask <span class="history_bold">{{ name }}</span>',
      UPD_CHL:
        '<span class="history_bold">{{ createdBy }}</span> edited the to-do <span class="history_bold">{{ name }}</span>',
      UPD_ATT:
        '<span class="history_bold">{{ createdBy }}</span> edited the attachment belonging to the task <span class="history_bold">{{ name }}</span>',
      DEL_TSK:
        '<span class="history_bold">{{ createdBy }}</span> deleted the task <span class="history_bold">{{ name }}</span>',
      DEL_SUB:
        '<span class="history_bold">{{ createdBy }}</span> deleted the sub task <span class="history_bold">{{ name }}</span>',
      DEL_CHL:
        '<span class="history_bold">{{ createdBy }}</span> deleted the to-do <span class="history_bold">{{ name }}</span>',
      DEL_ATT:
        '<span class="history_bold">{{ createdBy }}</span> deleted the attachment belonging to the task <span class="history_bold">{{ name }}</span>',
      CHG_TSK:
        '<span class="history_bold">{{ createdBy }}</span> has changed the status of the task <span class="history_bold">{{ name }}</span>',
      CHG_SUB:
        '<span class="history_bold">{{ createdBy }}</span> has changed the status of the sub-task <span class="history_bold">{{ name }}</span>',
    },
    private: {
      ADD_TSK:
        '<span class="history_bold">{{ createdBy }}</span> has created this task',
      ADD_ATT:
        '<span class="history_bold">{{ createdBy }}</span> has added a new attachment',
      ADD_SUB:
        '<span class="history_bold">{{ createdBy }}</span> added new subtask <span class="history_bold">{{ name }}</span>',
      ADD_CHL:
        '<span class="history_bold">{{ createdBy }}</span> added new task todo <span class="history_bold">{{ name }}</span>',
      UPD_TSK:
        '<span class="history_bold">{{ createdBy }}</span> edited this task',
      UPD_SUB:
        '<span class="history_bold">{{ createdBy }}</span> edited subtask <span class="history_bold">{{ name }}</span>',
      UPD_CHL:
        '<span class="history_bold">{{ createdBy }}</span> edited task todo <span class="history_bold">{{ name }}</span>',
      UPD_ATT:
        '<span class="history_bold">{{ createdBy }}</span> edited the attachment of the task',
      DEL_SUB:
        '<span class="history_bold">{{ createdBy }}</span> deleted the subtask <span class="history_bold">{{ name }}</span>',
      DEL_CHL:
        '<span class="history_bold">{{ createdBy }}</span> deleted the task todo <span class="history_bold">{{ name }}</span>',
      DEL_ATT:
        '<span class="history_bold">{{ createdBy }}</span> deleted the attachment',
      CHG_TSK:
        '<span class="history_bold">{{ createdBy }}</span> changed the status of the task from <span class="history_bold">{{ oldValue }}</span> to <span class="history_bold">{{ newValue }}</span>',
      CHG_SUB:
        '<span class="history_bold">{{ createdBy }}</span> has changed the status of the child task <span class="history_bold">{{ name }}</span> from <span class="history_bold">{{ oldValue }}</span> to <span class="history_bold">{{ newValue }}</span>',
    },
    sending: 'Sending',
    sent: 'Sent',
    error: 'An error occurred',
    taskDaily: 'Daily recurring task',
    timeDaily: 'Task recurring time',
    approver: 'Approver',
    approverPlace: 'Select approver',
    rate: 'Rating',
    ratePlace: 'Enter rating',
    rateComment: 'Comment',
    completedDate: 'Completed Date:',
    'name-placeholder': 'Enter task name',
    description: 'Description',
    'description-placeholder': 'Enter task description',
    subtask: 'Subtasks',
    'subtask-placeholder': 'Enter subtask name',
    checklist: 'Checklist',
    'checklist-placeholder': 'Add checklist item',
    attachment: 'Attachments',
    'attachment-placeholder-1': 'Drag and drop files or click',
    'attachment-placeholder-2': 'here',
    'attachment-placeholder-3': 'to upload',
    'priority-danger': 'Urgent',
    'priority-high': 'High',
    'priority-medium': 'Medium',
    'priority-low': 'Low',
    status: 'Status',
    assign: 'Assignee',
    priority: 'Priority',
    tag: 'Tags',
    'execution-date': 'Planned Execution Date',
    'remind-date': 'Reminder',
    activate: 'Activate',
    comment: 'Write a comment...',
    you: 'You',
    commented: 'commented',
    'checklist-name-placeholder': 'Checklist Name',
    'created-date': 'Created Date:',
    'start-date': 'Start Date:',
    'due-date': 'Due Date:',
    at: 'at',
    'search-assignee-placeholder': 'Search assignee',
    'list-assignee': 'Assignee List',
    assignee: 'Assignee',
    remind: 'Reminder',
    'setting-remind': 'Reminder Setting',
    'remind-type': 'Reminder Time Type',
    d: 'Day',
    h: 'Hour',
    m: 'Minute',
    time: 'Time',
    'input-time': 'Enter reminder time',
    'create-or-search': 'Create or Search',
    'add-coodinator': {
      'placeholder-selectOrg': 'Select Unit',
      selectCoodinator: 'Coordinator',
      'placeholder-selectCoodinator': 'Select Coordinator',
    },
    button: {
      cancel: 'Cancel',
      save: 'Save',
      'add-subtask': 'Add Subtask',
      'add-checklist': 'Add Checklist',
      share: 'Share',
      delete: 'Delete',
      reset: 'Reset',
      apply: 'Apply',
      today: 'Today',
      send: 'Send',
      'add-item': 'Add Item',
      'change-name': 'Change Name',
      'assign-all': 'Assign All to',
      'un-assign-all': 'Unassign All',
      'check-all': 'Check All',
      'uncheck-all': 'Uncheck All',
      edit: 'Edit',
      clone: 'Clone',
      'permission-and-share': 'Permission and Share',
      'copy-link': 'Copy Link',
    },
    message: {
      'create-success': 'Task created successfully',
      'create-error': 'Failed to create task',
      'save-success': 'Task information saved successfully',
      'save-error': 'Failed to save task information',
      'create-subtask-success': 'Subtask created successfully',
      'create-subtask-error': 'Failed to create subtask',
      'update-subtask-success': 'Subtask information saved successfully',
      'update-subtask-error': 'Failed to save subtask information',
      'delete-success': 'Task deleted successfully',
      'delete-error': 'Failed to delete task',
      'clone-success': 'Task cloned successfully',
      'clone-error': 'Failed to clone task',
      'assign-success': 'Task assigned successfully',
      'assign-error': 'Failed to assign task',
      addSubtaskError: 'An error occurred while adding subtask',
      updateSubtaskError: 'Failed to update subtask',
      addTaskSuccess: 'Task added successfully',
      addTaskError: 'Failed to add task',
      updateTaskError: 'Failed to update task',
      addChecklistError: 'An error occurred while adding checklist',
      updateChecklistError: 'An error occurred while updating checklist',
      deleteChecklistError: 'An error occurred while deleting checklist',
      uploadFileError: 'Failed to upload file',
      deleteFileError: 'Failed to delete file',
      updateFileError: 'Failed to update file',
      getSubtaskInfoError:
        'An error occurred while fetching subtask information',
      commentError: 'Failed to add comment',
      deleteSubtaskError: 'Delete subtask failed',
    },
    notify: {
      cancel: {
        title: 'Confirm Cancel',
        message: 'If you cancel, all your changes will not be saved',
        buttonCancel: 'Go Back',
        buttonSubmit: 'Cancel',
      },
    },
  },
  '8-3-EVENTS':
    '🎉 <strong>Chúc mừng ngày 8/3!</strong> 🎉</p><p>Gửi đến các chị em <strong>BA, Tester &amp; đội triển khai</strong> – những người luôn tận tâm, sáng tạo và mạnh mẽ!&nbsp;</p><p>💐 Chúc các bạn luôn rạng rỡ, hạnh phúc và thành công!</p><p>🌸 <strong>Happy Women’s Day!</strong> 🌸</p>',
  ASSIGN_TASK_LIST_TO_ORG:
    'Phòng ban <span style="{{ style }}">{{ orgName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_TASK_LIST_TO_ORGTooltip:
    'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} gán vào không gian {{ listTaskName }}',
  ASSIGN_TASK_LIST_TO_GROUP:
    'Nhóm <span style="{{ style }}">{{ groupName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào không gian <span style="{{ style }}">{{listTaskName}}</span>',
  ASSIGN_TASK_LIST_TO_GROUPTooltip:
    'Nhóm {{ groupName }} của bạn đã được người dùng {{createdBy}} gán vào không gian {{listTaskName}}',
  LIST_OWNER_DELETED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã xóa không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  LIST_OWNER_DELETEDTooltip:
    'Người dùng {{ createdBy }} đã xóa không gian {{ listTaskName }}',
  LIST_OWNER_DELETED_TASK:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã xoá công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  LIST_OWNER_DELETED_TASKTooltip:
    'Người dùng {{ createdBy }} đã xoá công việc {{ name }} thuộc không gian {{ listTaskName }}',
  ASSIGN_TASK_LIST_TO_USER:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_TASK_LIST_TO_USERTooltip:
    'Bạn đã được người dùng {{ createdBy }} gán vào không gian {{ listTaskName }}',
  ASSIGN_TASK_TO_USER:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_TASK_TO_USERTooltip:
    'Bạn đã được người dùng {{ createdBy }} gán vào công việc {{ name }} thuộc không gian {{ listTaskName }}',
  ASSIGN_TASK_TO_GROUP:
    'Nhóm <span style="{{ style }}">{{ groupName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_TASK_TO_GROUPTooltip:
    'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc {{ name }} thuộc không gian {{ listTaskName }}',
  ASSIGN_TASK_TO_ORG:
    'Phòng ban <span style="{{ style }}">{{ orgName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_TASK_TO_ORGTooltip:
    'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc {{ name }} thuộc không gian {{ listTaskName }}',
  ASSIGN_SUBTASK_TO_USER:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào công việc con <span style="{{ style }}">{{ name }}</span> thuộc công việc <span style="{{ style }}">{{ taskName }}</span> của không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_SUBTASK_TO_USERTooltip:
    'Bạn đã được người dùng{{ createdBy }} gán vào công việc con {{ name }} thuộc công việc {{ taskName }} của không gian{{ listTaskName }}',
  ASSIGN_SUBTASK_TO_GROUP:
    'Nhóm <span style="{{ style }}">{{ groupName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào công việc con <span style="{{ style }}">{{ name }}</span> thuộc công việc <span style="{{ style }}">{{ taskName }}</span> của không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_SUBTASK_TO_GROUPTooltip:
    'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc con {{ name }} thuộc công việc {{ taskName }} của không gian {{ listTaskName }}',
  ASSIGN_SUBTASK_TO_ORG:
    'Phòng ban <span style="{{ style }}">{{ orgName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán vào công việc con <span style="{{ style }}">{{ name }}</span> thuộc công việc <span style="{{ style }}">{{ taskName }}</span> của không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_SUBTASK_TO_ORGTooltip:
    'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} gán vào công việc con {{ name }} thuộc công việc {{ taskName }} của không gian {{ listTaskName }}',
  ASSIGN_USER_AS_TASK_APPROVED:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán là người phê duyệt công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_USER_AS_TASK_APPROVEDTooltip:
    'Bạn đã được người dùng {{ createdBy }} gán là người phê duyệt công việc {{ name }} thuộc không gian {{ listTaskName }}',
  TASK_NEEDS_APPROVED:
    'Công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span> vừa được người dùng <span style="{{ style }}">{{ createdBy }}</span> chuyển sang trạng thái <span style="{{ style }}">Chờ phê duyệt</span>. Vui lòng truy cập và phê duyệt công việc.',
  TASK_NEEDS_APPROVEDTooltip:
    'Công việc {{ name }} thuộc không gian {{ listTaskName }} vừa được người dùng {{ createdBy }} chuyển sang trạng thái Chờ phê duyệt. Vui lòng truy cập và phê duyệt công việc.',
  TASK_APPROVED:
    'Công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span> đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phê duyệt sang trạng thái Hoàn thành.',
  TASK_APPROVEDTooltip:
    'Công việc {{ name }} thuộc không gian {{ listTaskName }} đã được người dùng {{ createdBy }} phê duyệt sang trạng thái Hoàn thành.',
  TASK_PENDING_APPROVED:
    'Công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span> đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> chuyển từ trạng thái <span style="{{ style }}">Chờ phê duyệt</span> về trạng thái <span style="{{ style }}">{{ newValue }}</span>',
  TASK_PENDING_APPROVEDTooltip:
    'Công việc {{ name }} thuộc không gian {{ listTaskName }} đã được người dùng {{ createdBy }} chuyển từ trạng thái Chờ phê duyệt về trạng thái {{ newValue }}',
  TASK_RATING_ADD:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã đánh giá {số sao} sao cho công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  TASK_RATING_ADDTooltip:
    'Người dùng {{ createdBy }} đã đánh giá {số sao} sao cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
  TASK_COMMENT_ADD:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã thêm nhận xét cho công việc {{ name }} thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  TASK_COMMENT_ADDTooltip:
    'Người dùng {{ createdBy }} đã thêm nhận xét cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
  TASK_RATING_UPDATED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã thay đổi đánh giá công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span> thành <span style="{{ style }}">{{ rating }}</span> sao',
  TASK_RATING_UPDATEDTooltip:
    'Người dùng {{ createdBy }} đã thay đổi đánh giá công việc {{ name }} thuộc không gian {{ listTaskName }} thành {{ rating }} sao',
  TASK_COMMENT_UPDATED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã thay đổi nhận xét cho công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  TASK_COMMENT_UPDATEDTooltip:
    'Người dùng {{ createdBy }} đã thay đổi nhận xét cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
  ASSIGNEE_UPDATE_TASK_STATUS_IN_MY_LIST:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã cập nhật trạng thái công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span> từ <span style="{{ style }}">{{ oldValue }}</span> sang <span style="{{ style }}">{{ newValue }}</span>',
  ASSIGNEE_UPDATE_TASK_STATUS_IN_MY_LISTTooltip:
    'Người dùng {{ createdBy }} đã cập nhật trạng thái công việc {{ name }} thuộc không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
  TASK_REMINDER:
    'Bạn có công việc <span style="{{ style }}">{{ name }}</span> cần thực hiện vào <span style="{{ style }}">{{ dueDate }}</span>. Vui lòng hoàn thành trước thời gian đến hạn.',
  TASK_REMINDERTooltip:
    'Bạn có công việc {{ name }} cần thực hiện vào {{ dueDate }}. Vui lòng hoàn thành trước thời gian đến hạn.',
  TASK_REMINDER_NO_DATE:
    'Bạn có công việc <span style="{{ style }}">{{ name }}</span> cần thực hiện. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
  TASK_REMINDER_NO_DATETooltip:
    'Bạn có công việc {{ name }} cần thực hiện. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
  TASK_OVERDUE_REMINDER:
    'Công việc <span style="{{ style }}">{{ name }}</span> đã trễ hạn {thời gian trễ hạn}. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
  TASK_OVERDUE_REMINDERTooltip:
    'Công việc {{ name }} đã trễ hạn {thời gian trễ hạn}. Vui lòng hoàn thành công việc trong thời gian sớm nhất.',
  ASSIGN_USER_AS_COORDINATOR:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> gán là người điều phối không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_USER_AS_COORDINATORTooltip:
    'Bạn đã được người dùng {{ createdBy }} gán là người điều phối không gian {{ listTaskName }}',
  ASSIGN_USER_AS_COORDINATOR_OWNER:
    'Người dùng <span style="{{ style }}">{{ coordinator }}</span> vừa được người điều phối <span style="{{ style }}">{{ createdBy }}</span> thêm vào danh sách người điều phối không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  ASSIGN_USER_AS_COORDINATOR_OWNERTooltip:
    'Người dùng {{ createdBy }} vừa được người điều phối {{ coordinator }} thêm vào danh sách người điều phối không gian {{ listTaskName }}',
  REMOVE_TASK_LIST_COORDINATOR:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> vừa xoá bạn khỏi danh sách người điều phối không gian <span style="{{ style }}">{{ listTaskName }}<span>',
  REMOVE_TASK_LIST_COORDINATORTooltip:
    'Người dùng {{ createdBy }} vừa xoá bạn khỏi danh sách người điều phối không gian {{ listTaskName }}',
  REMOVE_TASK_LIST_COORDINATOR_OWNER:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> vừa xoá người dùng <span style="{{ style }}">{{ coordinator }}</span> khỏi danh sách người điều phối không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  REMOVE_TASK_LIST_COORDINATOR_OWNERTooltip:
    'Người dùng {{ createdBy }} vừa xoá người dùng {{ coordinator }} khỏi danh sách người điều phối không gian {{ listTaskName }}',
  SHARE_TASK_LIST_TO_USER:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TASK_LIST_TO_USERTooltip:
    'Bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian {{ listTaskName }}',
  SHARE_TASK_LIST_TO_GROUP:
    'Nhóm <span style="{{ style }}">{{ groupName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TASK_LIST_TO_GROUPTooltip:
    'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian {{ listTaskName }}',
  SHARE_TASK_LIST_TO_ORG:
    'Phòng ban <span style="{{ style }}">{{ orgName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TASK_LIST_TO_ORGTooltip:
    'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian {{ listTaskName }}',
  SHARE_TASK_TO_USER:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào mẫu công việc <span style="{{ style }}">{{ name }}</span> của không gian mẫu công việc <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TASK_TO_USERTooltip:
    'Bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào mẫu công việc {{ name }} của không gian mẫu công việc {{ listTaskName }}',
  SHARE_TASK_TO_GROUP:
    'Nhóm <span style="{{ style }}">{{ groupName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào mẫu công việc <span style="{{ style }}">{{ name }}</span> của không gian mẫu công việc <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TASK_TO_GROUPTooltip:
    'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào mẫu công việc {{ name }} của không gian mẫu công việc {{ listTaskName }}',
  SHARE_TASK_TO_ORG:
    'Phòng ban <span style="{{ style }}">{{ orgName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào công việc <span style="{{ style }}">{{ name }}</span> của không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TASK_TO_ORGTooltip:
    'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào công việc {{ name }} của không gian {{ listTaskName }}',
  SHARE_TEMPALTE_TASK_LIST_TO_USER:
    'Bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào không gian mẫu công việc <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TEMPALTE_TASK_LIST_TO_USERTooltip:
    'Bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian mẫu công việc {{ listTaskName }}',
  SHARE_TEMPALTE_TASK_LIST_TO_GROUP:
    'Nhóm <span style="{{ style }}">{{ groupName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào không gian mẫu công việc <span style="{{ style }}">{{ listTaskName }}</span>',
  SHARE_TEMPALTE_TASK_LIST_TO_GROUPTooltip:
    'Nhóm {{ groupName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào không gian mẫu công việc {{ listTaskName }}',
  SHARE_TEMPALTE_TASK_LIST_TO_ORG:
    'Phòng ban <span style="{{ style }}">{{ orgName }}</span> của bạn đã được người dùng <span style="{{ style }}">{{ createdBy }}</span> phân quyền <span style="{{ style }}">{{ aclName }}</span> vào template <span style="{{ style }}">{{ name }}</span>',
  SHARE_TEMPALTE_TASK_LIST_TO_ORGTooltip:
    'Phòng ban {{ orgName }} của bạn đã được người dùng {{ createdBy }} phân quyền {{ aclName }} vào template {{ name }}',
  LIST_OWNER_INFO_UPDATED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã chỉnh sửa thông tin <span style="{{ style }}">{{ attr }}</span> cho không gian <span style="{{ style }}">{{ listTaskName }}</span> từ <span style="{{ style }}">{{ oldValue }}</span> sang <span style="{{ style }}">{{ newValue }}</span>',
  LIST_OWNER_INFO_UPDATEDTooltip:
    'Người dùng {{ createdBy }} đã chỉnh sửa thông tin {{ attr }} cho không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
  USER_ADD_INFO_TO_LIST:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> có quyền <span style="{{ style }}">{{ aclName }}</span> đã thêm thông tin <span style="{{ style }}">{{ attr }}</span> có giá trị <span style="{{ style }}">{{ newValue }}</span> cho không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  USER_ADD_INFO_TO_LISTTooltip:
    'Người dùng {{ createdBy }} có quyền {{ aclName }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho không gian {{ listTaskName }}',
  LIST_OWNER_ADD_INFO:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã thêm thông tin <span style="{{ style }}">{{ attr }}</span> có giá trị <span style="{{ style }}">{{ newValue }}</span> cho không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  LIST_OWNER_ADD_INFOTooltip:
    'Người dùng {{ createdBy }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho không gian {{ listTaskName }}',
  LIST_OWNER_UPDATED_TASK_INFO:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã chỉnh sửa thông tin <span style="{{ style }}">{{ attr }}</span> cho công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span> từ <span style="{{ style }}">{{ oldValue }}</span> sang <span style="{{ style }}">{{ newValue }}</span>',
  LIST_OWNER_UPDATED_TASK_INFOTooltip:
    'Người dùng {{ createdBy }} đã chỉnh sửa thông tin {{ attr }} cho công việc {{ name }} thuộc không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
  TASK_PERMISSION_DELETED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> có quyền <span style="{{ style }}">{{ aclName }}</span> đã xoá công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  TASK_PERMISSION_DELETEDTooltip:
    'Người dùng {{ createdBy }} có quyền {{ aclName }} đã xoá công việc {{ name }} thuộc không gian {{ listTaskName }}',
  TASK_OWNER_ADD_INFO:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã thêm thông tin <span style="{{ style }}">{{ attr }}</span> có giá trị <span style="{{ style }}">{{ newValue }}</span> cho công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  TASK_OWNER_ADD_INFOTooltip:
    'Người dùng {{ createdBy }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
  TASK_PERMISSION_UPDATED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> có quyền <span style="{{ style }}">{{ aclName }}</span> đã chỉnh sửa thông tin <span style="{{ style }}">{{ attr }}</span> cho công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span> từ <span style="{{ style }}">{{ oldValue }}</span> sang <span style="{{ style }}">{{ newValue }}</span>',
  TASK_PERMISSION_UPDATEDTooltip:
    'Người dùng {{ createdBy }} có quyền {{ aclName }} đã chỉnh sửa thông tin {{ attr }} cho công việc {{ name }} thuộc không gian {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
  TASK_PERMISSION_ADD_INFO:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> có quyền <span style="{{ style }}">{{ aclName }}</span> đã thêm thông tin <span style="{{ style }}">{{ attr }}</span> có giá trị <span style="{{ style }}">{{ newValue }}</span> cho công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  TASK_PERMISSION_ADD_INFOTooltip:
    'Người dùng {{ createdBy }} có quyền {{ aclName }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho công việc {{ name }} thuộc không gian {{ listTaskName }}',
  COORDINATOR_ADDED_NEW_TASK:
    'Người điều phối <span style="{{ style }}">{{ createdBy }}</span> vừa thêm công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  COORDINATOR_ADDED_NEW_TASKTooltip:
    'Người điều phối {{ createdBy }} vừa thêm công việc {{ name }} thuộc không gian {{ listTaskName }}',
  TEMPLATE_OWNER_UPDATED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã chỉnh sửa thông tin <span style="{{ style }}">{{ attr }}</span> cho template <span style="{{ style }}">{{ listTaskName }}</span> từ <span style="{{ style }}">{{ oldValue }}</span> sang <span style="{{ style }}">{{ newValue }}</span>',
  TEMPLATE_OWNER_UPDATEDTooltip:
    'Người dùng {{ createdBy }} đã chỉnh sửa thông tin {{ attr }} cho template {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
  TEMPLATE_OWNER_DELETED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã xoá template <span style="{{ style }}">{{ listTaskName }}</span>',
  TEMPLATE_OWNER_DELETEDTooltip:
    'Người dùng {{ createdBy }} đã xoá template {{ listTaskName }}',
  TEMPLATE_OWNER_ADD_INFO:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> đã thêm thông tin <span style="{{ style }}">{{ attr }}</span> có giá trị <span style="{{ style }}">{{ newValue }}</span> cho template <span style="{{ style }}">{{ listTaskName }}</span>',
  TEMPLATE_OWNER_ADD_INFOTooltip:
    'Người dùng {{ createdBy }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho template {{ listTaskName }}',
  TEMPLATE_PERMISSION_EDITED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> có quyền {{ aclName }} đã chỉnh sửa thông tin {{ attr }} cho template {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
  TEMPLATE_PERMISSION_EDITEDTooltip:
    'Người dùng {{ createdBy }} có quyền {{ aclName }} đã chỉnh sửa thông tin {{ attr }} cho template {{ listTaskName }} từ {{ oldValue }} sang {{ newValue }}',
  TEMPLATE_PERMISSION_DELETED:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> có quyền {{ aclName }} đã xoá template <span style="{{ style }}">{{ listTaskName }}</span>',
  TEMPLATE_PERMISSION_DELETEDTooltip:
    'Người dùng {{ createdBy }} có quyền {{ aclName }} đã xoá template {{ listTaskName }}',
  TEMPLATE_PERMISSION_ADD_INFO:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> có quyền <span style="{{ style }}">{{ aclName }}</span> đã thêm thông tin <span style="{{ style }}">{{ attr }}</span> có giá trị <span style="{{ style }}">{{ newValue }}</span> cho template <span style="{{ style }}">{{ listTaskName }}</span>',
  TEMPLATE_PERMISSION_ADD_INFOTooltip:
    'Người dùng {{ createdBy }} có quyền {{ aclName }} đã thêm thông tin {{ attr }} có giá trị {{ newValue }} cho template {{ listTaskName }}',
  NOTIFY_COMMENT:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> vừa đề cập bạn trong công việc <span style="{{ style }}">{{ name }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  NOTIFY_COMMENTTooltip:
    'Người dùng {{ createdBy }} vừa đề cập bạn trong công việc {{ name }} thuộc không gian {{ listTaskName }}',
  NOTIFY_SUBTASK_COMMENT:
    'Người dùng <span style="{{ style }}">{{ createdBy }}</span> vừa đề cập bạn trong công việc con <span style="{{ style }}">{{ name }}</span> nằm trong công việc <span style="{{ style }}">{{ taskName }}</span> thuộc không gian <span style="{{ style }}">{{ listTaskName }}</span>',
  NOTIFY_SUBTASK_COMMENTTooltip:
    'Người dùng {{ createdBy }} vừa đề cập bạn trong công việc con {{ name }} nằm trong công việc {{ taskName }} thuộc không gian {{ listTaskName }}',
};
