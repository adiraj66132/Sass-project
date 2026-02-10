export interface ConfettiProps {
    colors?: string[];
}

export function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];
    const colors = ['#ffffff', '#f0f0f0', '#a0a0a0', '#404040'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2,
        });
    }

    let animationId: number;
    let opacity = 1;

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        opacity -= 0.01;

        if (opacity <= 0) {
            cancelAnimationFrame(animationId);
            document.body.removeChild(canvas);
            return;
        }

        ctx.globalAlpha = opacity;

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.vx *= 0.96; // friction

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        animationId = requestAnimationFrame(animate);
    };

    animate();
}
