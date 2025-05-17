document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        document.getElementById('originalImg').src = event.target.result;
    };
    
    reader.readAsDataURL(file);
});

document.getElementById('rotateBtn').addEventListener('click', function() {
    const angle = parseInt(document.getElementById('angleSelect').value);
    const originalImg = document.getElementById('originalImg');
    
    if (!originalImg.src) {
        alert('请先上传图像');
        return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        if (angle % 90 !== 0) {
            alert('本工具仅支持90°倍数的旋转');
            return;
        }
        
        // 调整画布大小以适应旋转
        if (angle % 180 === 0) {
            canvas.width = img.width;
            canvas.height = img.height;
        } else {
            canvas.width = img.height;
            canvas.height = img.width;
        }
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        document.getElementById('resultImg').src = canvas.toDataURL();
        document.getElementById('downloadBtn').href = canvas.toDataURL();
    };
    
    img.src = originalImg.src;
});