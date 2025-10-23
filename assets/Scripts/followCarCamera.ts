import { _decorator, Component, Node, Vec3, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('followCarCamera')
export class followCarCamera extends Component {
    @property(Node)
    public target: Node = null; // The car to follow
    
    @property(Camera)
    public camera: Camera = null; // The camera component
    
    // Isometric camera settings
    @property
    public followHeight: number = 15; // How high above the car
    
    @property
    public followDistance: number = 12; // How far back from the car
    
    @property
    public followSmoothness: number = 5; // How smoothly the camera follows (higher = smoother)
    
    @property
    public lookAheadDistance: number = 5; // How far ahead of the car to look
    
    // Isometric angle settings
    @property
    public isometricAngleX: number = 45; // Pitch angle for isometric view
    
    @property
    public isometricAngleY: number = 45; // Yaw angle for isometric view
    
    private targetPosition: Vec3 = new Vec3();
    private lookAtPosition: Vec3 = new Vec3();
    
    protected onLoad(): void {
        // Set up isometric projection
        // if (this.camera) {
        //     this.camera.orthoHeight = 20; // Adjust this for zoom level
        //     this.camera.projection = Camera.ProjectionType.ORTHO;
        // }
    }
    
    protected lateUpdate(dt: number): void {
        if (!this.target) return;
        
        this.updateCameraPosition(dt);
        this.updateCameraLookAt(dt);
    }
    
    private updateCameraPosition(dt: number): void {
        // Get the target's position and forward direction
        const targetPos = this.target.worldPosition;
        const targetForward = this.target.forward;
        
        // Calculate isometric offset based on the car's rotation
        const offsetBack = Vec3.multiplyScalar(new Vec3(), targetForward, -this.followDistance);
        const offsetUp = new Vec3(0, this.followHeight, 0);
        
        // Apply isometric rotation to the offset
        const isometricOffset = this.calculateIsometricOffset(offsetBack, offsetUp);
        
        // Calculate desired camera position
        Vec3.add(this.targetPosition, targetPos, isometricOffset);
        
        // Smoothly interpolate to the target position
        const currentPos = this.node.worldPosition;
        Vec3.lerp(currentPos, currentPos, this.targetPosition, this.followSmoothness * dt);
        this.node.worldPosition = currentPos;
    }
    
    private updateCameraLookAt(dt: number): void {
        // Calculate where the camera should look (ahead of the car)
        const targetPos = this.target.worldPosition;
        const targetForward = this.target.forward;
        const lookAhead = Vec3.multiplyScalar(new Vec3(), targetForward, this.lookAheadDistance);
        
        Vec3.add(this.lookAtPosition, targetPos, lookAhead);
        
        // Make the camera look at the target
        this.node.lookAt(this.lookAtPosition, Vec3.UP);
    }
    
    private calculateIsometricOffset(backOffset: Vec3, upOffset: Vec3): Vec3 {
        // Create the isometric offset by combining back and up offsets
        // with additional side offset for true isometric view
        const sideOffset = Vec3.cross(new Vec3(), Vec3.UP, backOffset.normalize());
        Vec3.multiplyScalar(sideOffset, sideOffset, this.followDistance * 0.5);
        
        // Combine all offsets for isometric positioning
        const totalOffset = new Vec3();
        Vec3.add(totalOffset, backOffset, upOffset);
        Vec3.add(totalOffset, totalOffset, sideOffset);
        
        return totalOffset;
    }
    
    // Method to adjust zoom level during runtime
    public setZoom(zoomLevel: number): void {
        if (this.camera) {
            this.camera.orthoHeight = zoomLevel;
        }
    }
    
    // Method to switch between orthographic and perspective
    public toggleProjection(): void {
        if (this.camera) {
            this.camera.projection = this.camera.projection === Camera.ProjectionType.ORTHO 
                ? Camera.ProjectionType.PERSPECTIVE 
                : Camera.ProjectionType.ORTHO;
        }
    }
}

