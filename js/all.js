$(document).ready(() => {
  let mode = 'all';
  let newTaskCount = parseInt(localStorage.getItem('newTaskCount'), 10) || 0;
  const taskDataList = JSON.parse(localStorage.getItem('taskDataList')) || [];
  let taskSortList = JSON.parse(localStorage.getItem('taskSortList')) || [];

  function renderTaskList() {
    let html = '';
    let taskLeft = 0;
    $.each(taskSortList, (index, id) => {
      const task = taskDataList.find(taskEach => taskEach.id === id);
      if (!task.isCompleted) {
        taskLeft += 1;
      }
      html += `
      <div data-id="${task.id}" class="${task.isStar ? 'isStar' : ''}${task.isCompleted ? 'isCompleted' : ''}">
        <div class="addTaskPanel">
          <div class="addTaskPanel_bar ${task.isStar ? 'isStar' : ''}">
            <div class="main">
              <input type="checkbox" class="completed" ${task.isCompleted ? 'checked' : ''} ${task.isEdit ? 'disabled' : ''}/>
              <input type="text" placeholder="Type Something Here..." maxlength="30" value="${task.title}" class="${task.isCompleted ? 'isCompleted' : ''}" ${task.isEdit ? '' : 'disabled'}/>
              <input type="checkbox" class="star ${task.isStar ? 'checked' : ''}" ${task.isEdit ? 'disabled' : ''}/>
              <div class="edit ${task.isEdit ? 'opened' : ''}"></div>
              <a href="#" class="delete"><i class="fas fa-trash-alt"></i></a>
            </div>
            <div class="information">
              <div class="informDate">
                <i class="far fa-calendar-alt"></i>
                <span>${task.date}</span>
              </div>
              <div class="informComment">
                <i class="far fa-comment-dots"></i>
                <span>${task.comment}</span>
              </div>
            </div>
          </div>
          <div class="addTaskPanel_content ${task.isEdit ? 'opened' : ''}">
            <div class="deadline">
              <div class="icon"></div>
              <div>Deadline<br/>
                <input type="date" placeholder="yyyy/mm/dd"/ value="${task.date}">
                <input type="time" placeholder="hh:mm"/ value="${task.time}">
              </div>
            </div>
            <div class="file">
              <div class="icon"></div>
              <div>File<br/>
                <input type="file" id="fileUpload" hidden="hidden"/>
                <label for="fileUpload" class="fileUploadIcon"></label>
              </div>
            </div>
            <div class="comment">
              <div class="icon"></div>
              <div>Comment<br/>
                <textarea rows="5" placeholder="Type your memo here...">${task.comment}</textarea>
              </div>
            </div>
            <div class="buttons">
              <div class="btn cancelBtn">X Cancel</div>
              <div class="btn saveTaskBtn">+ Save</div>
            </div>
          </div>
        </div>
      </div>
      `;
    });
    $('.tasks_list').html(html);
    $('.task_left').html(`${taskLeft} tasks left`);
  }

  function getTaskContent(btn) {
    const taskPanel = btn.closest('.addTaskPanel');
    const taskData = {
      id: taskPanel.parent().data('id') === undefined ? newTaskCount : taskPanel.parent().data('id'),
      title: taskPanel.find('input[type="text"]').val(),
      isCompleted: taskPanel.find('.addTaskPanel_bar input[type=checkbox]').prop('checked'),
      isStar: taskPanel.find('.star').prop('checked'),
      isEdit: taskPanel.find('tasks_list .edit').hasClass('opened'),
      date: taskPanel.find('input[type=date]').val(),
      time: taskPanel.find('input[type=time]').val(),
      comment: taskPanel.find('textarea').val(),
    };
    if (taskData.id === newTaskCount) {
      taskDataList.push(taskData);
      taskSortList.push(taskData.id);
    } else {
      const task = taskDataList.find(taskEach => taskEach.id === taskData.id);
      const taskIndex = taskDataList.indexOf(task);
      taskDataList[taskIndex] = taskData;
    }
    localStorage.setItem('taskDataList', JSON.stringify(taskDataList));
    localStorage.setItem('taskSortList', JSON.stringify(taskSortList));
    renderTaskList();
  }

  // mode change
  $('.list li').on('click', function () {
    $('.list li').removeClass('active');
    $(this).addClass('active');
    mode = $(this).data('mode');
    switch (mode) {
      case 'all':
        $('.tasks_list [data-id]').show('fast');
        break;
      case 'progress':
        $('.tasks_list [data-id]').show();
        $('.tasks_list [data-id]').filter('.isCompleted').hide('fast');
        break;
      case 'completed':
        $('.tasks_list [data-id]').show();
        $('.tasks_list [data-id]').not('.isCompleted').hide('fast');
        break;
      default:
        break;
    }
  });

  // add task input
  $('.addTask').on('click', function () {
    $('.addTaskPanel').slideDown('fast');
    $('.addTaskPanel').find('.edit').hasClass('opened') ? $('.addTaskPanel').find('.edit').removeClass('opened') : $('.addTaskPanel').find('.edit').addClass('opened');
    $(this).hide();
  });

  // cancel btn
  $('.btn.cancelBtn').on('click', function () {
    $('.addTaskPanel').find('.edit').hasClass('opened') ? $('.addTaskPanel').find('.edit').removeClass('opened') : $('.addTaskPanel').find('.edit').addClass('opened');
    $('.addTaskBlank .addTaskPanel').hide();
    $('input.addTask').show();
  });

  // add task btn
  $('.addTaskBtn').on('click', function () {
    getTaskContent($(this));
    $(this).closest('.addTaskPanel').find('input[type="text"], textarea').val('');
    $(this).closest('.addTaskPanel').hide();
    $('.addTask').show();
    $('.addTaskBlank .edit').removeClass('opened');
    newTaskCount += 1;
    localStorage.setItem('newTaskCount', newTaskCount);
  });

  // completed btn (list)
  $('ul.tasks_list').on('click', '.completed', function () {
    const taskID = $(this).closest('[data-id]').data('id');
    const task = taskDataList.find(taskInArray => taskInArray.id === taskID);
    const taskIndex = taskDataList.indexOf(task);
    $(this).prop('checked') ? taskDataList[taskIndex].isCompleted = true : taskDataList[taskIndex].isCompleted = false;
    localStorage.setItem('taskDataList', JSON.stringify(taskDataList));
    renderTaskList();
  });

  // star btn (list)
  $('ul.tasks_list').on('click', '.star', function () {
    const taskID = $(this).closest('[data-id]').data('id');
    const task = taskDataList.find(taskInArray => taskInArray.id === taskID);
    const taskIndex = taskDataList.indexOf(task);
    const taskSortIndex = taskSortList.indexOf(taskID);
    $(this).hasClass('checked') ? $(this).removeClass('checked') : $(this).addClass('checked');
    $(this).hasClass('checked') ? taskDataList[taskIndex].isStar = true : taskDataList[taskIndex].isStar = false;
    if ($(this).hasClass('checked')) {
      taskSortList.unshift(taskSortList.splice(taskSortIndex, 1)[0]);
      localStorage.setItem('taskSortList', JSON.stringify(taskSortList));
    }
    localStorage.setItem('taskDataList', JSON.stringify(taskDataList));
    renderTaskList();
  });

  // edit btn (list)
  $('ul.tasks_list').on('click', '.edit', function () {
    const taskID = $(this).closest('[data-id]').data('id');
    const task = taskDataList.find(taskInArray => taskInArray.id === taskID);
    const taskIndex = taskDataList.indexOf(task);
    $(this).closest('.addTaskPanel').find('.addTaskPanel_content').toggle();
    $(this).hasClass('opened') ? $(this).removeClass('opened') : $(this).addClass('opened');
    $(this).hasClass('opened') ? taskDataList[taskIndex].isEdit = true : taskDataList[taskIndex].isEdit = false;
    localStorage.setItem('taskDataList', JSON.stringify(taskDataList));
    renderTaskList();
  });

  // cancel btn (list)
  $('ul.tasks_list').on('click', '.btn.cancelBtn', function () {
    const taskID = $(this).closest('[data-id]').data('id');
    const task = taskDataList.find(taskInArray => taskInArray.id === taskID);
    const taskIndex = taskDataList.indexOf(task);
    taskDataList[taskIndex].isEdit = false;
    localStorage.setItem('taskDataList', JSON.stringify(taskDataList));
    renderTaskList();
  });

  // save btn (list)
  $('ul.tasks_list').on('click', '.btn.saveTaskBtn', function () {
    getTaskContent($(this));
    const taskID = $(this).closest('[data-id]').data('id');
    const task = taskDataList.find(taskInArray => taskInArray.id === taskID);
    const taskIndex = taskDataList.indexOf(task);
    taskDataList[taskIndex].isEdit = false;
    localStorage.setItem('taskDataList', JSON.stringify(taskDataList));
    renderTaskList();
  });

  // delete btn (list)
  $('ul.tasks_list').on('click', '.delete', function () {
    const taskID = $(this).closest('[data-id]').data('id');
    const task = taskDataList.find(taskInArray => taskInArray.id === taskID);
    const taskIndex = taskDataList.indexOf(task);
    taskDataList.splice(taskIndex, 1);
    localStorage.setItem('taskDataList', JSON.stringify(taskDataList));
    const taskSortIndex = taskSortList.indexOf(taskID);
    taskSortList.splice(taskSortIndex, 1);
    localStorage.setItem('taskSortList', JSON.stringify(taskSortList));
    $(this).closest('.addTaskPanel').fadeOut(() => renderTaskList());
  });

  // sortable
  $('ul.tasks_list').sortable({
    opacity: 0.5,
    items: '[data-id]:not(.isStar)',
  });

  $('ul.tasks_list').on('sortupdate', function () {
    taskSortList = $(this).find('[data-id]').map((task, index) => {
      return $(index).data('id');
    }).get();
    localStorage.setItem('taskSortList', JSON.stringify(taskSortList));
    renderTaskList();
  });
  renderTaskList();
});

