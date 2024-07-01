import { Level } from '../objects/Level'

export class HUDScene extends Phaser.Scene {
    private progressBar: Phaser.GameObjects.Graphics
    private progressBox: Phaser.GameObjects.Graphics
    private progressValue: number

    constructor() {
        super({ key: 'HUDScene' })
    }

    create(): void {
        // Tạo một hình chữ nhật cho hộp bao quanh thanh tiến trình
        this.progressBox = this.add.graphics()
        this.progressBox.fillStyle(0x222222, 0.8) // Màu xám tối, độ mờ 80%
        this.progressBox.fillRect(600, 100, 320, 50) // Vị trí (240, 270), kích thước (320, 50)

        // Tạo thanh tiến trình
        this.progressBar = this.add.graphics()

        // Giá trị tiến trình ban đầu (0 đến 1)
        this.progressValue = 0

        // Vẽ thanh tiến trình ban đầu
        this.updateProgressBar(this.progressValue)
    }

    updateProgressBar(value: number): void {
        this.progressValue = value
        this.progressBar.clear()
        this.progressBar.fillStyle(0xffffff, 1) // Màu trắng
        this.progressBar.fillRect(600, 100, value, 50) // Vị trí (250, 280), chiều rộng thay đổi theo giá trị, chiều cao 30
    }

    // Phương thức để cập nhật tiến trình
    setProgress(value: number): void {
        this.updateProgressBar(value)
    }

    update(time: number, delta: number): void {
        Level.getInstance(this).update(time, delta)
        this.setProgress(Level.getInstance(this).getExp())
    }
}
