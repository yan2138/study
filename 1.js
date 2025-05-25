 document.addEventListener('DOMContentLoaded', function() {
            const imageUpload = document.getElementById('image-upload');
            const originalCanvas = document.getElementById('original-canvas');
            const rotatedCanvas = document.getElementById('rotated-canvas');
            const rotate90Btn = document.getElementById('rotate-90');
            const rotate180Btn = document.getElementById('rotate-180');
            const rotate270Btn = document.getElementById('rotate-270');
            const rotateCustomBtn = document.getElementById('rotate-custom');
            const customAngleInput = document.getElementById('custom-angle');
            const downloadBtn = document.getElementById('download-btn');
            
            let originalImage = null;
            let currentRotation = 0;
            
            imageUpload.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        originalImage = new Image();
                        originalImage.onload = function() {
                            drawOriginalImage();
                            resetRotation();
                        };
                        originalImage.src = event.target.result;
                    };
                    
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
            
            function drawOriginalImage() {
                const ctx = originalCanvas.getContext('2d');
                originalCanvas.width = originalImage.width;
                originalCanvas.height = originalImage.height;
                ctx.drawImage(originalImage, 0, 0);
            }
            
            function resetRotation() {
                currentRotation = 0;
                customAngleInput.value = '0';
                applyRotation();
            }
            
            function applyRotation() {
                if (!originalImage) return;
                
                if (currentRotation % 90 === 0) {
                    apply90DegreeRotation();
                } else {
                    applyArbitraryRotation();
                }
                
                downloadBtn.disabled = false;
            }
            
            function apply90DegreeRotation() {
                const ctx = rotatedCanvas.getContext('2d');
                
                const normalizedRotation = ((currentRotation % 360) + 360) % 360;
                
                if (normalizedRotation === 90 || normalizedRotation === 270) {
                    rotatedCanvas.width = originalImage.height;
                    rotatedCanvas.height = originalImage.width;
                } else {
                    rotatedCanvas.width = originalImage.width;
                    rotatedCanvas.height = originalImage.height;
                }
                
                ctx.clearRect(0, 0, rotatedCanvas.width, rotatedCanvas.height);
                ctx.save();
                
                switch (normalizedRotation) {
                    case 90:
                        ctx.translate(rotatedCanvas.width, 0);
                        ctx.rotate(Math.PI / 2);
                        break;
                    case 180:
                        ctx.translate(rotatedCanvas.width, rotatedCanvas.height);
                        ctx.rotate(Math.PI);
                        break;
                    case 270:
                        ctx.translate(0, rotatedCanvas.height);
                        ctx.rotate(Math.PI * 1.5);
                        break;
                    default: 
                        break;
                }
                
                ctx.drawImage(originalImage, 0, 0);
                ctx.restore();
            }
            
            function applyArbitraryRotation() {
                const ctx = rotatedCanvas.getContext('2d');
                const radians = currentRotation * Math.PI / 180;
                
                const sin = Math.abs(Math.sin(radians));
                const cos = Math.abs(Math.cos(radians));
                const newWidth = originalImage.width * cos + originalImage.height * sin;
                const newHeight = originalImage.width * sin + originalImage.height * cos;
                
                rotatedCanvas.width = newWidth;
                rotatedCanvas.height = newHeight;
                
                ctx.clearRect(0, 0, rotatedCanvas.width, rotatedCanvas.height);
                ctx.save();
                
                ctx.translate(newWidth / 2, newHeight / 2);
                ctx.rotate(radians);
                ctx.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2);
                
                ctx.restore();
            }
            
            rotate90Btn.addEventListener('click', function() {
                currentRotation += 90;
                customAngleInput.value = currentRotation % 360;
                applyRotation();
            });
            
            rotate180Btn.addEventListener('click', function() {
                currentRotation += 180;
                customAngleInput.value = currentRotation % 360;
                applyRotation();
            });
            
            rotate270Btn.addEventListener('click', function() {
                currentRotation += 270;
                customAngleInput.value = currentRotation % 360;
                applyRotation();
            });
            
            rotateCustomBtn.addEventListener('click', function() {
                const angle = parseInt(customAngleInput.value);
                if (!isNaN(angle)) {
                    currentRotation = angle;
                    applyRotation();
                }
            });
            
            downloadBtn.addEventListener('click', function() {
                if (!originalImage) return;
                
                const link = document.createElement('a');
                link.download = 'rotated-image.png';
                link.href = rotatedCanvas.toDataURL('image/png');
                link.click();
            });
        });