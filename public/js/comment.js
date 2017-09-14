/**
 * Created by bulusi on 2017/9/14.
 */

//当前文章的id
var contentId = window.location.href.split('?').pop().split('=').pop()

var loadCommentDone = function(){
    //添加提交事件
    $(document).one('click','#comment-submit',function(){
        $.ajax({
            url:'/api/comment/post',
            type:'POST',
            data:{
                contentId:contentId,
                content:$('#comment-input').val()
            },
            dataType:'json',
            success: function(data){
                if(!data.code){//成功
                    $('.comments-box').load('/view/comments?content_id='+contentId,loadCommentDone)
                }
            }
        })
    })
}
//加载评论
$('.comments-box').load('/view/comments?content_id='+contentId,loadCommentDone)
