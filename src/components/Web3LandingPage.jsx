"use client"


import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Web3LandingPage = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // Create models
    const models = [];

    // Intro model: Rotating Earth
    const earthGroup = new THREE.Group();
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      specular: 0xffffff,
      shininess: 10
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // Add simple continents
    const continentGeometry = new THREE.SphereGeometry(1.01, 32, 32);
    const continentMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    for (let i = 0; i < 5; i++) {
      const continent = new THREE.Mesh(continentGeometry, continentMaterial);
      continent.scale.setScalar(Math.random() * 0.3 + 0.1);
      continent.position.setFromSpherical(new THREE.Spherical(
        1,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      ));
      continent.lookAt(new THREE.Vector3());
      earthGroup.add(continent);
    }
    models.push(earthGroup);

    // Decentralization model: Network
    const networkGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const nodePositions = [];
    for (let i = 0; i < 20; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
        Math.random() * 4 - 2
      );
      nodePositions.push(node.position);
      networkGroup.add(node);
    }
    // Add connections
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.5) {
          const geometry = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
          const line = new THREE.Line(geometry, lineMaterial);
          networkGroup.add(line);
        }
      }
    }
    models.push(networkGroup);

    // Blockchain model: Chain of cubes
    const blockchainGroup = new THREE.Group();
    const blockGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.3);
    const blockMaterial = new THREE.MeshPhongMaterial({ color: 0x4287f5 });
    for (let i = 0; i < 7; i++) {
      const block = new THREE.Mesh(blockGeometry, blockMaterial);
      block.position.set(i * 0.7 - 2, Math.sin(i * 0.5) * 0.5, 0);
      block.rotation.z = Math.sin(i * 0.5) * 0.2;
      blockchainGroup.add(block);
      if (i > 0) {
        const linkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
        const linkMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const link = new THREE.Mesh(linkGeometry, linkMaterial);
        link.position.set(i * 0.7 - 2.35, Math.sin((i - 0.5) * 0.5) * 0.5, 0);
        link.rotation.z = Math.PI / 2 + (Math.sin((i - 0.5) * 0.5) * 0.2);
        blockchainGroup.add(link);
      }
    }
    models.push(blockchainGroup);

    // Crypto & NFTs model: Floating coins and cubes
    const cryptoGroup = new THREE.Group();
    const coinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const coinMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const nftGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const nftMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xff0000 }),
      new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
      new THREE.MeshPhongMaterial({ color: 0x0000ff }),
    ];
    for (let i = 0; i < 5; i++) {
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coin.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
      coin.rotation.set(Math.random() * Math.PI, 0, 0);
      cryptoGroup.add(coin);
      
      const nft = new THREE.Mesh(nftGeometry, nftMaterials[i % 3]);
      nft.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
      nft.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      cryptoGroup.add(nft);
    }
    models.push(cryptoGroup);

    // Revolution model: Expanding network
    const revolutionGroup = new THREE.Group();
    const coreSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const coreSphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff3366 });
    const coreSphere = new THREE.Mesh(coreSphereGeometry, coreSphereMaterial);
    revolutionGroup.add(coreSphere);
    
    const satelliteGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const satelliteMaterial = new THREE.MeshPhongMaterial({ color: 0x33ff66 });
    for (let i = 0; i < 20; i++) {
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = Math.random() * 1.5 + 0.5;
      satellite.position.setFromSpherical(new THREE.Spherical(radius, phi, theta));
      revolutionGroup.add(satellite);
      
      const connectionGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), satellite.position]);
      const connectionMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
      const connection = new THREE.Line(connectionGeometry, connectionMaterial);
      revolutionGroup.add(connection);
    }
    models.push(revolutionGroup);

    models.forEach((model, index) => {
      model.position.set(0, -index * 10, 0);
      scene.add(model);
    });

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      models.forEach((model, index) => {
        if (index === activeSection) {
          model.rotation.y += 0.005;
          if (index === 1) { // Network model
            model.children.forEach(child => {
              if (child instanceof THREE.Mesh) {
                child.position.y += Math.sin(Date.now() * 0.001 + child.position.x) * 0.001;
              }
            });
          } else if (index === 3) { // Crypto & NFTs model
            model.children.forEach(child => {
              child.rotation.x += 0.01;
              child.rotation.y += 0.01;
            });
          } else if (index === 4) { // Revolution model
            model.children.forEach((child, i) => {
              if (child instanceof THREE.Mesh && i > 0) {
                child.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.02);
              }
            });
          }
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    // GSAP Animations and Scroll Events
    models.forEach((model, index) => {
      ScrollTrigger.create({
        trigger: `#section-${index}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setActiveSection(index);
          gsap.to(camera.position, {
            x: 0,
            y: -index * 10,
            z: 5,
            duration: 1,
            ease: "power2.inOut"
          });
          gsap.to(model.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1 });
          gsap.to(model.position, { x: 2, duration: 1 });
        },
        onLeave: () => {
          gsap.to(model.scale, { x: 1, y: 1, z: 1, duration: 1 });
          gsap.to(model.position, { x: 0, duration: 1 });
        },
        onEnterBack: () => {
          setActiveSection(index);
          gsap.to(camera.position, {
            x: 0,
            y: -index * 10,
            z: 5,
            duration: 1,
            ease: "power2.inOut"
          });
          gsap.to(model.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1 });
          gsap.to(model.position, { x: 2, duration: 1 });
        },
        onLeaveBack: () => {
          gsap.to(model.scale, { x: 1, y: 1, z: 1, duration: 1 });
          gsap.to(model.position, { x: 0, duration: 1 });
        }
      });
    });

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeSection]);

  const sections = [
    {
      title: "Welcome to Web3",
      content: "Embark on a journey through the decentralized future of the internet."
    },
    {
      title: "Decentralization",
      content: "Web3 creates a more open, interconnected network where users have control over their data and digital identities."
    },
    {
      title: "Blockchain Technology",
      content: "The backbone of Web3, enabling secure, transparent, and tamper-resistant record-keeping for all types of transactions."
    },
    {
      title: "Crypto & NFTs",
      content: "Digital assets and tokens powering the new internet economy, enabling new forms of ownership and value exchange."
    },
    {
      title: "Join the Revolution",
      content: "Be part of the paradigm shift in how we interact online, creating a more equitable and user-centric digital world."
    }
  ];

  return (
    <div style={{ 
      height: '500vh', 
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0 }} />
      {sections.map((section, index) => (
        <section 
          id={`section-${index}`}
          key={index} 
          style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            color: 'white',
            padding: '2rem',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ 
            maxWidth: '50%', 
            marginright: '50%', 
            padding: '2rem',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '10px'
          }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{section.title}</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{
                section.content}</p>
                {index === 1 && (
                  <button 
                    style={buttonStyle} 
                    onClick={() => alert("Connecting to decentralized network...")}
                  >
                    Connect to Network
                  </button>
                )}
                {index === 2 && (
                  <button 
                    style={buttonStyle} 
                    onClick={() => alert("Adding block to the chain...")}
                  >
                    Add Block
                  </button>
                )}
                {index === 3 && (
                  <div>
                    <button 
                      style={buttonStyle} 
                      onClick={() => alert("Creating new token...")}
                    >
                      Create Token
                    </button>
                    <button 
                      style={{...buttonStyle, marginLeft: '10px'}} 
                      onClick={() => alert("Minting new NFT...")}
                    >
                      Mint NFT
                    </button>
                  </div>
                )}
                {index === 4 && (
                  <button 
                    style={buttonStyle} 
                    onClick={() => alert("Welcome to the Web3 revolution!")}
                  >
                    Join Now
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>
      );
    };
    
    const buttonStyle = {
      padding: '10px 20px',
      fontSize: '1rem',
      color: 'white',
      backgroundColor: '#4CAF50',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#45a049'
      }
    };
    
    export default Web3LandingPage;