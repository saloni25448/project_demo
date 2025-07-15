$(document).ready(function() {
    // Mobile menu toggle
    $('.mobile-menu-btn').click(function() {
        $('.main-nav').toggleClass('active');
    });
    
    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 500);
    });
    
    // Task card hover effect
    $(document).on('mouseenter', '.task-card', function() {
        $(this).css('transform', 'translateY(-5px)');
        $(this).css('box-shadow', '0 10px 20px rgba(0, 0, 0, 0.1)');
    }).on('mouseleave', '.task-card', function() {
        $(this).css('transform', 'translateY(0)');
        $(this).css('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
    });
    
    // Mark task as complete
    $(document).on('change', '.task-checkbox', function() {
        const taskId = $(this).data('task-id');
        const isCompleted = $(this).is(':checked');
        
        // Update UI
        if (isCompleted) {
            $(this).closest('.task-card').addClass('completed');
            $(this).siblings('.task-status').text('Completed').removeClass('in-progress pending').addClass('completed');
        } else {
            $(this).closest('.task-card').removeClass('completed');
            $(this).siblings('.task-status').text('Pending').removeClass('in-progress completed').addClass('pending');
        }
        
        
        console.log(`Task ${taskId} marked as ${isCompleted ? 'completed' : 'pending'}`);
    });
    
    // Delete task
    $(document).on('click', '.delete-task', function() {
        const taskId = $(this).data('task-id');
        if (confirm('Are you sure you want to delete this task?')) {
            $(this).closest('.task-card').fadeOut(300, function() {
                $(this).remove();
                // Here you would typically make an AJAX call to delete from server
                console.log(`Task ${taskId} deleted`);
            });
        }
    });
    
    // Filter tasks
    $('#task-filter').change(function() {
        const filterValue = $(this).val().toLowerCase();
        $('.task-card').each(function() {
            const taskStatus = $(this).find('.task-status').text().toLowerCase();
            if (filterValue === 'all' || taskStatus === filterValue) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Search tasks
    $('#task-search').on('keyup', function() {
        const searchText = $(this).val().toLowerCase();
        $('.task-card').each(function() {
            const taskName = $(this).find('.task-name').text().toLowerCase();
            if (taskName.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Form validation for task creation
    $('#task-form').submit(function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate task name
        if ($('#task-name').val().trim() === '') {
            $('#task-name').addClass('error');
            isValid = false;
        } else {
            $('#task-name').removeClass('error');
        }
        
        // Validate due date
        if ($('#due-date').val() === '') {
            $('#due-date').addClass('error');
            isValid = false;
        } else {
            $('#due-date').removeClass('error');
        }
        
        if (isValid) {
            // Form is valid, submit to server
            alert('Task created successfully!');
            // Here you would typically make an AJAX call to submit the form
            this.reset();
        }
    });
    
    // Initialize datepicker
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true
    });
    
    // Make tasks sortable (drag and drop)
    $('.task-list').sortable({
        handle: '.drag-handle',
        update: function(event, ui) {
            // Get the new order of tasks
            const taskOrder = [];
            $('.task-card').each(function(index) {
                taskOrder.push($(this).data('task-id'));
            });
            
            //  send the new order to the server
            console.log('New task order:', taskOrder);
        }
    });
});