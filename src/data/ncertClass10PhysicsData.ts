import { ConceptItem } from '../types/science';

export const NCERT_CLASS10_PHYSICS_CONCEPTS: ConceptItem[] = [
  // =========================================================================
  // CHAPTER: LIGHT - REFLECTION AND REFRACTION
  // =========================================================================
  {
    id: 'ncert10-phy-spherical-mirrors-reflection',
    title: 'Reflection by Spherical Mirrors & Cartesian Sign Convention',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Pole, Center of Curvature, Principal Axis, Focus, and New Cartesian Sign Convention',
    description:
      'Spherical mirrors have reflecting surfaces that form part of an imaginary hollow glass sphere. In a Concave mirror, reflection occurs at the inward-curved surface (converging mirror, focal length f < 0). In a Convex mirror, reflection occurs at the outward-curved surface (diverging mirror, focal length f > 0). According to the New Cartesian Sign Convention: (1) Object is always placed to the left of the mirror; (2) All distances parallel to the principal axis are measured from the Pole (P) as the origin; (3) Distances measured in the direction of incident light (+x, right of pole) are positive; distances against incident light (-x, left of pole) are negative; (4) Distances measured perpendicular to and above the principal axis (+y) are positive; downwards (-y) are negative.',
    formulaLaTeX: 'R = 2f \\quad | \\quad f = \\frac{R}{2}',
    formulaExplanation:
      'For spherical mirrors of small aperture, the radius of curvature (R) is exactly twice the focal length (f). The principal focus (F) lies midway between the pole (P) and the center of curvature (C).',
    variables: [
      {
        id: 'focalLengthMm',
        name: 'Focal Length (f)',
        symbol: 'f',
        unit: 'cm',
        min: -50,
        max: 50,
        step: 5,
        defaultValue: -20,
        description: 'Focal length of the mirror (- for concave, + for convex).',
      },
      {
        id: 'objectDistanceU',
        name: 'Object Distance (u)',
        symbol: 'u',
        unit: 'cm',
        min: -80,
        max: -10,
        step: 5,
        defaultValue: -40,
        description: 'Distance of the object from pole P (always negative by Cartesian sign convention).',
      },
    ],
    prediction: {
      prompt: 'What happens to the focal length of a concave mirror when it is immersed in water (refractive index n = 1.33)?',
      scenario:
        'A concave mirror has a focal length of 20 cm in air. It is fully submerged into a glass water tank.',
      choices: [
        {
          id: 'p1',
          text: 'Focal length remains unchanged at exactly 20 cm.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Focal length decreases because light travels slower in water.',
          isCorrect: false,
          misconceptionExplanation:
            'Confusion with lenses! Focal length of a mirror depends solely on its geometric radius of curvature (f = R/2) and the Law of Reflection (angle i = angle r), which is strictly independent of the surrounding optical medium.',
        },
        {
          id: 'p3',
          text: 'Focal length increases by a factor of 1.33.',
          isCorrect: false,
          misconceptionExplanation:
            'Reflection obeys angle i = angle r regardless of refractive index. Only refracting lenses change focal length across media.',
        },
      ],
      correctExplanation:
        'Reflection depends exclusively on the Law of Reflection (angle of incidence = angle of reflection), governed entirely by surface geometry (R = 2f). Since immersion in water does not change the physical curvature radius of the glass mirror, its focal length remains completely unaffected.',
      relevantFormula: 'f = \\frac{R}{2} \\quad (\\text{Independent of medium } n)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Solar Concentrator Furnaces',
        description: 'Large concave mirrors focus parallel solar rays to a high-temperature focal point exceeding 3000°C.',
      },
      {
        title: 'Dentist Head Mirrors & Searchlights',
        description: 'Concave mirrors produce powerful parallel light beams when the lamp is placed at the principal focus.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-concave-mirror-image-formation',
    title: 'Concave Mirror Ray Optics & 6 Object Positions',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Real inverted images from infinity to F, and enlarged virtual erect image between F and P',
    description:
      'A concave mirror produces images whose nature, position, and size depend strictly on object distance u relative to F and C: (1) Object at infinity -> image at F, highly diminished point-sized, real & inverted; (2) Beyond C -> image between F and C, diminished, real & inverted; (3) At C -> image at C, same size as object, real & inverted; (4) Between C and F -> image beyond C, magnified, real & inverted; (5) At F -> image at infinity, highly magnified, real & inverted; (6) Between Pole P and Focus F -> image formed behind the mirror, magnified, virtual & erect (used as shaving/makeup mirror).',
    formulaLaTeX: '\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} \\quad | \\quad m = -\\frac{v}{u} = \\frac{h\'}{h}',
    formulaExplanation:
      'The Mirror Formula relates object distance u, image distance v, and focal length f. Linear magnification m gives the ratio of image height h\' to object height h. A negative m indicates a real, inverted image; a positive m indicates a virtual, erect image.',
    variables: [
      {
        id: 'objectDistanceU',
        name: 'Object Distance (u)',
        symbol: 'u',
        unit: 'cm',
        min: -60,
        max: -5,
        step: 2,
        defaultValue: -30,
        description: 'Distance of object from pole (concave mirror focal length f = -15 cm, C = -30 cm).',
      },
      {
        id: 'objectHeightHo',
        name: 'Object Height (h)',
        symbol: 'h',
        unit: 'cm',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 4,
        description: 'Height of the upright object placed on principal axis.',
      },
    ],
    prediction: {
      prompt: 'An object is placed 10 cm in front of a concave mirror of focal length 15 cm. What is the nature and location of the image?',
      scenario: 'Object distance u = -10 cm, focal length f = -15 cm. Here |u| < |f|, so the object lies between Pole and Focus.',
      choices: [
        {
          id: 'p1',
          text: 'Virtual, erect, magnified, formed 30 cm behind the mirror (v = +30 cm).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Real, inverted, diminished, formed 30 cm in front of the mirror (v = -30 cm).',
          isCorrect: false,
          misconceptionExplanation:
            'When an object is placed between focus and pole of a concave mirror, reflected rays diverge. Their backward extensions intersect behind the mirror, creating a virtual erect image.',
        },
        {
          id: 'p3',
          text: 'Real, inverted, formed at the center of curvature (v = -30 cm).',
          isCorrect: false,
          misconceptionExplanation:
            '1/v = 1/f - 1/u = 1/(-15) - 1/(-10) = -1/15 + 1/10 = 1/30. Thus v = +30 cm (positive indicates behind the mirror).',
        },
      ],
      correctExplanation:
        'Applying the mirror formula: 1/v + 1/(-10) = 1/(-15) => 1/v = -1/15 + 1/10 = 1/30 => v = +30 cm. Magnification m = -v/u = -(30)/(-10) = +3. The image is virtual, erect, and magnified 3 times behind the mirror.',
      relevantFormula: '\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{-15} - \\frac{1}{-10} = +\\frac{1}{30}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Shaving and Makeup Vanity Mirrors',
        description: 'Holding the mirror close to the face (within focal length) produces an upright, magnified reflection of skin details.',
      },
      {
        title: 'Automobile Headlight Reflectors',
        description: 'Positioning a high-intensity filament bulb at the focus of a concave mirror casts an intense parallel beam along the road.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-convex-mirror-rear-view',
    title: 'Convex Mirror Ray Optics & Automobile Rear-View Mirrors',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Always virtual, erect, diminished images with wide field of view',
    description:
      'A convex mirror is a diverging mirror whose reflecting surface bulges outwards. For any real object positioned in front of a convex mirror (from infinity up to the pole), the reflected rays diverge and appear to meet behind the mirror between Pole P and Focus F. Consequently, the image is ALWAYS: (1) Virtual; (2) Erect; (3) Diminished in size (magnification 0 < m < 1); (4) Formed behind the mirror between P and F. Because the mirror curves outward, it provides a much wider field of view than a flat plane mirror, enabling drivers to monitor traffic over a large rear expanse.',
    formulaLaTeX: '\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} \\quad (f > 0, \\, u < 0 \\implies v > 0, \\, m = -\\frac{v}{u} < 1)',
    formulaExplanation:
      'Because f is positive and u is negative, 1/v = 1/f - 1/u is strictly positive, ensuring v is always positive and smaller in magnitude than u. Thus, the image is always virtual, erect, and diminished.',
    variables: [
      {
        id: 'convexRadiusR',
        name: 'Radius of Curvature (R)',
        symbol: 'R',
        unit: 'm',
        min: 1,
        max: 6,
        step: 0.5,
        defaultValue: 3,
        description: 'Radius of curvature of convex rear-view mirror (f = R/2 = +1.5 m).',
      },
      {
        id: 'vehicleDistanceU',
        name: 'Rear Vehicle Distance (u)',
        symbol: 'u',
        unit: 'm',
        min: -20,
        max: -2,
        step: 1,
        defaultValue: -5,
        description: 'Distance of approaching vehicle behind the car.',
      },
    ],
    prediction: {
      prompt: 'Why are convex mirrors preferred as rear-view mirrors in vehicles over plane mirrors?',
      scenario: 'A truck approaches a car from 10 meters behind. The driver checks the side rear-view mirror.',
      choices: [
        {
          id: 'p1',
          text: 'They always give an erect diminished image and offer a much wider field of view.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'They magnify the approaching vehicle so it looks closer.',
          isCorrect: false,
          misconceptionExplanation:
            'Convex mirrors diminish objects (m < 1). Warning: "Objects in the mirror are closer than they appear."',
        },
        {
          id: 'p3',
          text: 'They form real inverted images on the driver’s retina directly.',
          isCorrect: false,
          misconceptionExplanation:
            'Images formed by convex mirrors are always virtual and erect, located behind the mirror surface.',
        },
      ],
      correctExplanation:
        'Convex mirrors are curved outwards, which gives them a significantly broader field of view compared to plane mirrors. Furthermore, they always yield erect though diminished images, allowing drivers to view entire trailing lanes safely.',
      relevantFormula: 'm = -\\frac{v}{u} < 1 \\quad (\\text{Always erect } m > 0 \\text{ and diminished})',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Automobile Passenger-Side Mirrors',
        description: 'Wide field of view allows lane-change monitoring with minimal blind spots.',
      },
      {
        title: 'Blind Corner Security Mirrors in Alleyways & Stores',
        description: 'Mounted at sharp corridor turns and shop ceilings to view oncoming traffic and aisles.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-refraction-snell-law',
    title: 'Refraction of Light & Snell’s Law of Refraction',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Bending of light across optical media due to speed variation: n21 = sin(i) / sin(r)',
    description:
      'Refraction is the phenomenon of bending of light at the interface separating two transparent optical media due to a change in the phase velocity of light. Snell’s Laws of Refraction state: (1) The incident ray, the refracted ray, and the normal to the interface at the point of incidence all lie in the same plane; (2) The ratio of the sine of the angle of incidence (i) to the sine of the angle of refraction (r) is constant for a given pair of media and given wavelength of light. When light travels from an optically rarer medium (air) to an optically denser medium (glass/water), it slows down and bends TOWARDS the normal (r < i). Conversely, when traveling from denser to rarer medium, it speeds up and bends AWAY from the normal (r > i).',
    formulaLaTeX: 'n_{21} = \\frac{\\sin i}{\\sin r} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1}',
    formulaExplanation:
      'Snell’s Law equates the ratio of sine of incidence and refraction angles to relative refractive index n_21, which represents the ratio of light speeds in medium 1 (v1) and medium 2 (v2).',
    variables: [
      {
        id: 'incidentAngleDeg',
        name: 'Angle of Incidence (i)',
        symbol: 'i',
        unit: 'deg',
        min: 0,
        max: 85,
        step: 5,
        defaultValue: 45,
        description: 'Angle between incident ray and normal in air.',
      },
      {
        id: 'mediumRefractiveIndexN',
        name: 'Refractive Index of Medium (n₂)',
        symbol: 'n_2',
        unit: 'unitless',
        min: 1.0,
        max: 2.42,
        step: 0.05,
        defaultValue: 1.5,
        description: 'Optical density (Air=1.0, Water=1.33, Crown Glass=1.52, Diamond=2.42).',
      },
    ],
    prediction: {
      prompt: 'A light ray enters water (n = 1.33) from air at an incident angle of 0° (along the normal). What is the angle of refraction?',
      scenario: 'Normal incidence: i = 0°. Light strikes the air-water boundary perpendicularly.',
      choices: [
        {
          id: 'p1',
          text: 'r = 0° (Light passes straight without any directional deviation).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'r = 45° due to the refractive index of water.',
          isCorrect: false,
          misconceptionExplanation:
            'By Snell’s law: sin(r) = sin(i)/n = sin(0°)/1.33 = 0, so r = 0°. Light does not bend when entering along the normal.',
        },
        {
          id: 'p3',
          text: 'Total internal reflection occurs immediately.',
          isCorrect: false,
          misconceptionExplanation:
            'TIR only occurs when light travels from denser to rarer medium exceeding critical angle, never at normal incidence from rarer to denser.',
        },
      ],
      correctExplanation:
        'When light strikes the interface normally (i = 0°), all wave points reach the boundary simultaneously. Although the speed decreases (v = c/n), no differential wavefront lag occurs; hence sin(r) = 0 => r = 0°, meaning zero bending.',
      relevantFormula: '\\sin r = \\frac{\\sin 0^\\circ}{n} = 0 \\implies r = 0^\\circ',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Apparent Depth of Swimming Pools',
        description: 'Water pools appear shallower than their true physical depth because light rays refract away from normal upon exiting water.',
      },
      {
        title: 'Apparent Bending of a Pencil in Water',
        description: 'A pencil immersed obliquely in a beaker of water appears broken or bent at the water surface due to refraction.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-glass-slab-lateral-displacement',
    title: 'Refraction through a Rectangular Glass Slab & Lateral Displacement',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Emergent ray is parallel to incident ray (i = e) with perpendicular shift d',
    description:
      'When a light ray enters a rectangular glass slab obliquely: (1) At the first air-glass interface (AB), light enters from rarer to denser medium and bends towards normal (r1 < i); (2) At the opposite parallel glass-air interface (CD), light exits from denser to rarer medium and bends away from normal by an equal amount (r2 = r1, e = i). Consequently, the emergent ray is strictly PARALLEL to the original direction of the incident ray. However, the path of the light ray is shifted sideways by a perpendicular distance called Lateral Displacement (d). Lateral displacement increases with: (a) thickness of the slab (t); (b) angle of incidence (i); (c) refractive index of glass (n).',
    formulaLaTeX: 'd = \\frac{t \\cdot \\sin(i - r)}{\\cos r} \\quad | \\quad \\angle i = \\angle e',
    formulaExplanation:
      'Lateral displacement d is directly proportional to glass slab thickness t and sine of deviation angle (i - r), inversely proportional to cos(r). Emergent angle e always equals incidence angle i.',
    variables: [
      {
        id: 'slabThicknessCm',
        name: 'Slab Thickness (t)',
        symbol: 't',
        unit: 'cm',
        min: 2,
        max: 15,
        step: 1,
        defaultValue: 6,
        description: 'Physical thickness of rectangular glass slab.',
      },
      {
        id: 'incidentAngleDeg',
        name: 'Angle of Incidence (i)',
        symbol: 'i',
        unit: 'deg',
        min: 15,
        max: 75,
        step: 5,
        defaultValue: 45,
        description: 'Angle of incident light beam against the slab normal.',
      },
    ],
    prediction: {
      prompt: 'If the thickness of a rectangular glass slab is doubled, what happens to the lateral displacement of the emergent ray for the same incident angle?',
      scenario: 'A glass slab of thickness t produces lateral displacement d. It is replaced by a slab of thickness 2t.',
      choices: [
        {
          id: 'p1',
          text: 'Lateral displacement is exactly doubled (2d).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Lateral displacement remains constant because angle i = angle e.',
          isCorrect: false,
          misconceptionExplanation:
            'While the direction remains parallel (i = e), the light ray travels twice as far inside the slab, doubling the lateral perpendicular shift.',
        },
        {
          id: 'p3',
          text: 'Lateral displacement quadruples (4d).',
          isCorrect: false,
          misconceptionExplanation:
            'Formula shows a strict linear relationship: d is directly proportional to t.',
        },
      ],
      correctExplanation:
        'From the geometric formula d = t * sin(i - r) / cos(r), lateral displacement d is directly proportional to slab thickness t. Doubling t doubles the distance traveled through the refracting medium, doubling the sideways displacement d.',
      relevantFormula: 'd \\propto t \\implies d\' = 2d',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Glass Paperweights on Printed Text',
        description: 'Letters beneath a thick glass block appear raised towards the eye while retaining their horizontal layout.',
      },
      {
        title: 'Optical Windows in High-Pressure Chambers',
        description: 'Parallel plate viewports shift laser beam positions without changing beam angular trajectory.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-convex-lens-image-formation',
    title: 'Convex Lens Converging Optics & Image Formations',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Converging double convex lens: Real inverted images & virtual magnifying glass',
    description:
      'A convex lens is thicker at the center than at the edges. Parallel incident rays converge to a real principal focus on the opposite side (f > 0). The nature and position of images follow 6 distinct object positions: (1) At infinity -> image at F2, highly diminished point-sized, real & inverted; (2) Beyond 2F1 -> image between F2 and 2F2, diminished, real & inverted; (3) At 2F1 -> image at 2F2, same size, real & inverted (m = -1); (4) Between F1 and 2F1 -> image beyond 2F2, magnified, real & inverted; (5) At F1 -> image at infinity, highly magnified, real & inverted; (6) Between optical center O and F1 -> image on same side as object, magnified, virtual & erect (Simple Microscope / Magnifying Glass).',
    formulaLaTeX: '\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f} \\quad | \\quad m = \\frac{v}{u} = \\frac{h\'}{h}',
    formulaExplanation:
      'The Lens Formula relates object distance u, image distance v, and focal length f (note the minus sign, unlike mirror formula). Linear magnification m = v/u.',
    variables: [
      {
        id: 'lensFocalLengthF',
        name: 'Focal Length (f)',
        symbol: 'f',
        unit: 'cm',
        min: 10,
        max: 40,
        step: 5,
        defaultValue: 20,
        description: 'Focal length of converging convex lens (positive).',
      },
      {
        id: 'objectDistanceU',
        name: 'Object Distance (u)',
        symbol: 'u',
        unit: 'cm',
        min: -60,
        max: -5,
        step: 5,
        defaultValue: -30,
        description: 'Distance of object from optical center O (negative).',
      },
    ],
    prediction: {
      prompt: 'Where must an object be placed in front of a convex lens to obtain a real image of the same size as the object?',
      scenario: 'A convex lens of focal length f = 15 cm is used on an optical bench.',
      choices: [
        {
          id: 'p1',
          text: 'At twice the focal length (u = -2f = -30 cm).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'At the principal focus (u = -f = -15 cm).',
          isCorrect: false,
          misconceptionExplanation:
            'When placed at focus F, refracted rays emerge parallel and form an infinitely magnified image at infinity.',
        },
        {
          id: 'p3',
          text: 'Between optical center and focus.',
          isCorrect: false,
          misconceptionExplanation:
            'This position produces a virtual, erect, and magnified image (magnifying glass effect).',
        },
      ],
      correctExplanation:
        'When an object is at 2F1 (u = -2f), 1/v = 1/f + 1/u = 1/f - 1/(2f) = 1/(2f) => v = +2f (at 2F2). Magnification m = v/u = (+2f)/(-2f) = -1. The negative sign denotes real and inverted, and magnitude 1 denotes identical object and image size.',
      relevantFormula: 'u = -2f \\implies v = +2f, \\quad m = \\frac{+2f}{-2f} = -1',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Photographic Camera & Projector Lenses',
        description: 'Focus real inverted scenes onto digital CMOS image sensors or projection screens.',
      },
      {
        title: 'Simple Magnifying Glass & Reading Glasses',
        description: 'Placing text closer than the focal length creates an erect, magnified virtual image.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-lens-power-combination',
    title: 'Power of a Lens & Combination of Thin Lenses',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Degree of convergence or divergence: P = 1/f (in meters), measured in Dioptres (D)',
    description:
      'The Power of a lens (P) is defined as the tangent of angle by which it converges or diverges a beam of light falling at unit distance from the optical center, equal to the reciprocal of its focal length expressed in meters. The SI unit of lens power is the Dioptre (D), where 1 D = 1 m⁻¹. A convex converging lens has positive power (f > 0, P > 0). A concave diverging lens has negative power (f < 0, P < 0). For several thin lenses placed in contact, their combined net power is the simple algebraic sum: P = P1 + P2 + P3 + ...',
    formulaLaTeX: 'P = \\frac{1}{f(\\text{in meters})} = \\frac{100}{f(\\text{in cm})} \\quad | \\quad P_{\\text{net}} = P_1 + P_2',
    formulaExplanation:
      'Power P is in Dioptres when focal length f is in meters. Thin lenses in contact add algebraically: a +2.5 D convex lens in contact with a -1.5 D concave lens yields P_net = +1.0 D.',
    variables: [
      {
        id: 'lens1PowerD',
        name: 'Lens 1 Power (P₁)',
        symbol: 'P_1',
        unit: 'D',
        min: -5,
        max: 5,
        step: 0.25,
        defaultValue: 2.5,
        description: 'Power of first lens (+ for convex, - for concave).',
      },
      {
        id: 'lens2PowerD',
        name: 'Lens 2 Power (P₂)',
        symbol: 'P_2',
        unit: 'D',
        min: -5,
        max: 5,
        step: 0.25,
        defaultValue: -1.5,
        description: 'Power of second lens placed in optical contact.',
      },
    ],
    prediction: {
      prompt: 'An optometrist prescribes corrective lenses of power P = -2.0 D. What is the type and focal length of this lens?',
      scenario: 'Eyeglass prescription for a student struggling to see the classroom blackboard.',
      choices: [
        {
          id: 'p1',
          text: 'Concave lens with focal length f = -0.5 m (-50 cm).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Convex lens with focal length f = +0.5 m (+50 cm).',
          isCorrect: false,
          misconceptionExplanation:
            'Negative power signifies a concave diverging lens used to correct myopia (near-sightedness).',
        },
        {
          id: 'p3',
          text: 'Concave lens with focal length f = -2.0 m (-200 cm).',
          isCorrect: false,
          misconceptionExplanation:
            'f = 1/P = 1/(-2.0) = -0.5 m, not -2.0 m.',
        },
      ],
      correctExplanation:
        'f = 1/P = 1/(-2.0 D) = -0.5 m = -50 cm. The negative focal length corresponds strictly to a concave (diverging) lens, which diverges incoming distant parallel rays so they focus accurately onto the myopic retina.',
      relevantFormula: 'f = \\frac{1}{P} = \\frac{1}{-2.0} = -0.5\\text{ m} = -50\\text{ cm}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Corrective Eyeglass Prescriptions',
        description: 'Ophthalmologists prescribe dioptre values for spectacle and contact lenses.',
      },
      {
        title: 'Compound Microscope Objective Lenses',
        description: 'Combining achromatic doublet lenses in contact cancels out chromatic and spherical aberrations.',
      },
    ],
    simulationType: 'class10-physics',
  },

  // =========================================================================
  // CHAPTER: THE HUMAN EYE AND THE COLOURFUL WORLD
  // =========================================================================
  {
    id: 'ncert10-phy-human-eye-accommodation',
    title: 'Structure of the Human Eye & Power of Accommodation',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Ciliary muscles dynamically adjust crystalline lens curvature (Near point = 25 cm, Far point = infinity)',
    description:
      'The human eye operates like an organic camera: (1) Cornea: transparent front bulge providing 80% of optical convergence; (2) Iris & Pupil: variable aperture controlling light intake; (3) Crystalline Lens: flexible fibrous jelly-like convex lens; (4) Ciliary Muscles: relax to flatten the lens (focal length increases to ~2.5 cm for viewing distant objects) and contract to round the lens (focal length decreases for viewing nearby objects); (5) Retina: light-sensitive screen containing ~125 million rods (light intensity) and cones (color vision); (6) Optic Nerve: transmits electrical action potentials to the visual cortex. Power of Accommodation is the ability of the crystalline lens to adjust its focal length. Near point of a normal eye = 25 cm (Least Distance of Distinct Vision D); Far point = infinity.',
    formulaLaTeX: 'D_{\\text{near}} = 25\\text{ cm} \\quad | \\quad D_{\\text{far}} = \\infty \\quad | \\quad P = \\frac{1}{f_{\\text{eye}}}',
    formulaExplanation:
      'To view near objects at 25 cm, ciliary muscles contract maximally. Viewing distant stars relaxes ciliary muscles, keeping the eye untired.',
    variables: [
      {
        id: 'objectDistanceEyeCm',
        name: 'Object Distance from Eye',
        symbol: 'd',
        unit: 'cm',
        min: 15,
        max: 200,
        step: 5,
        defaultValue: 25,
        description: 'Distance of reading text from the eye (normal near point = 25 cm).',
      },
      {
        id: 'ciliaryTensionPercent',
        name: 'Ciliary Muscle Contraction',
        symbol: '\\sigma',
        unit: '%',
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 100,
        description: 'Muscle contraction strain (0% for infinity, 100% for 25 cm).',
      },
    ],
    prediction: {
      prompt: 'When a person looks from a book at 25 cm up to clouds in the sky, what happens to the ciliary muscles and the focal length of the eye lens?',
      scenario: 'Transitioning from near reading vision to infinity distant vision.',
      choices: [
        {
          id: 'p1',
          text: 'Ciliary muscles relax, the eye lens becomes thinner, and focal length increases.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Ciliary muscles contract, the lens becomes thicker, and focal length decreases.',
          isCorrect: false,
          misconceptionExplanation:
            'Contraction occurs when looking at near objects, which thickens the lens to decrease focal length.',
        },
        {
          id: 'p3',
          text: 'Focal length remains fixed because organic lenses cannot change shape.',
          isCorrect: false,
          misconceptionExplanation:
            'The crystalline lens is flexible and altered dynamically by ciliary muscles (accommodation).',
        },
      ],
      correctExplanation:
        'To focus distant light rays onto the retina (image distance fixed at ~2.5 cm), the lens must have weaker convergence (longer focal length). The ciliary muscles relax, pulling the suspensory ligaments tight, flattening the crystalline lens into a thinner profile with increased focal length.',
      relevantFormula: 'f_{\\text{eye}} \\uparrow \\text{ when ciliary muscles relax for } d \\to \\infty',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Ergonomic Reading Distance',
        description: 'Holding books at 25 cm avoids asthenopia (eye strain) caused by over-contracting ciliary muscles.',
      },
      {
        title: 'Virtual Reality Headsets',
        description: 'Collimating lenses simulate an optical infinity focus so users can view screens 5 cm from their eyes without strain.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-myopia-hypermetropia-defects',
    title: 'Defects of Vision: Myopia & Hypermetropia Correction',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Myopia (short-sightedness -> concave lens) vs Hypermetropia (far-sightedness -> convex lens)',
    description:
      'Two major refractive defects of the human eye: (1) Myopia (Near-sightedness): Person can see nearby objects clearly but cannot see distant objects distinctly. Far point is closer than infinity. Causes: excessive curvature of cornea/lens or elongation of eyeball. Parallel rays from distant objects converge in front of retina. Correction: Concave diverging lens of focal length f = -d_far, which diverges parallel rays so they appear to originate from the myopic far point; (2) Hypermetropia (Far-sightedness): Person can see distant objects clearly but cannot see nearby objects distinctly. Near point recedes beyond 25 cm (e.g. 50-100 cm). Causes: focal length of lens is too long or eyeball is too short. Rays from normal near point (25 cm) focus behind retina. Correction: Convex converging lens of power P > 0, which provides additional convergence.',
    formulaLaTeX: 'P_{\\text{myopia}} = -\\frac{1}{d_{\\text{far}}} \\quad | \\quad P_{\\text{hyper}} = \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{d_{\\text{near}}} - \\frac{1}{-0.25}',
    formulaExplanation:
      'For myopia, the corrective concave lens creates a virtual image of infinity at the defective far point. For hypermetropia, the convex lens forms a virtual image of an object at 25 cm at the defective near point.',
    variables: [
      {
        id: 'defectTypeIdx',
        name: 'Vision Defect',
        symbol: 'Defect',
        unit: 'mode',
        min: 1,
        max: 2,
        step: 1,
        defaultValue: 1,
        description: '1 for Myopia (in front of retina), 2 for Hypermetropia (behind retina).',
      },
      {
        id: 'correctiveLensActive',
        name: 'Apply Corrective Spectacle Lens',
        symbol: 'Lens',
        unit: 'toggle',
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        description: '0 = Uncorrected Defect, 1 = Corrected by spectacle lens.',
      },
    ],
    prediction: {
      prompt: 'A person with a myopic eye has a far point of 80 cm. What lens power is required to restore normal distant vision?',
      scenario: 'Distant stars or blackboard at infinity must produce a virtual image at the person’s far point (v = -80 cm = -0.8 m).',
      choices: [
        {
          id: 'p1',
          text: 'P = -1.25 D (Concave lens of focal length -80 cm).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'P = +1.25 D (Convex lens of focal length +80 cm).',
          isCorrect: false,
          misconceptionExplanation:
            'A convex lens would increase convergence, worsening myopia and pulling the focal point even further in front of the retina.',
        },
        {
          id: 'p3',
          text: 'P = -0.80 D.',
          isCorrect: false,
          misconceptionExplanation:
            'P = 1/f = 1/(-0.8 m) = -1.25 D, not -0.8 D.',
        },
      ],
      correctExplanation:
        'Using lens formula with u = -infinity and v = -80 cm = -0.8 m: 1/f = 1/v - 1/u = 1/(-0.8) - 0 = -1.25 m^-1. Thus focal length f = -0.8 m (-80 cm) and lens power P = -1.25 Dioptres (concave lens).',
      relevantFormula: 'P = \\frac{1}{f} = \\frac{1}{-0.8\\text{ m}} = -1.25\\text{ D}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Prescription Spectacles & Contact Lenses',
        description: 'Concave eyeglasses restore sharp distant vision for billions of school students and drivers worldwide.',
      },
      {
        title: 'LASIK Refractive Corneal Surgery',
        description: 'Excimer lasers remodel corneal curvature to permanently adjust focal length without glasses.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-prism-dispersion-spectrum',
    title: 'Refraction & Dispersion of White Light through a Glass Prism',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'VIBGYOR Spectrum: Red bends least (longest wavelength), Violet bends most (shortest wavelength)',
    description:
      'A triangular glass prism has two triangular bases and three rectangular lateral refracting surfaces inclined at the Angle of Prism (A). When a ray of white light enters the prism: (1) It refracts at the first face and bends towards normal; (2) It refracts at the second face and bends away from normal, emerging as the emergent ray deviated by the Angle of Deviation (D): i + e = A + D; (3) Dispersion: White light is a superposition of 7 spectral colors. Because the refractive index of glass varies inversely with wavelength (Cauchy’s relation n_violet > n_red), violet light travels slowest in glass and bends through the greatest angle of deviation. Red light has the longest visible wavelength (~700 nm), travels fastest in glass, and deviates the least. This splits white light into the VIBGYOR band. Isaac Newton demonstrated recombination by placing an identical inverted prism, proving white light consists of these 7 colors.',
    formulaLaTeX: '\\angle i + \\angle e = \\angle A + \\angle D \\quad | \\quad n(\\lambda) = A + \\frac{B}{\\lambda^2} \\implies D_{\\text{violet}} > D_{\\text{red}}',
    formulaExplanation:
      'Angle of deviation D depends on angle of prism A and refractive index n. Since n is higher for shorter wavelengths (violet ~400 nm) than longer wavelengths (red ~700 nm), violet light deviates most.',
    variables: [
      {
        id: 'prismAngleA',
        name: 'Prism Angle (A)',
        symbol: 'A',
        unit: 'deg',
        min: 30,
        max: 75,
        step: 5,
        defaultValue: 60,
        description: 'Angle between the two refracting lateral faces of the glass prism.',
      },
      {
        id: 'incidenceAngleI',
        name: 'Angle of Incidence (i)',
        symbol: 'i',
        unit: 'deg',
        min: 25,
        max: 65,
        step: 5,
        defaultValue: 45,
        description: 'Angle of incoming white light beam at first face.',
      },
    ],
    prediction: {
      prompt: 'Which spectral color of white light undergoes the maximum angle of deviation when passing through a glass prism?',
      scenario: 'A narrow beam of sunlight passes through an equilateral triangular crown glass prism.',
      choices: [
        {
          id: 'p1',
          text: 'Violet light, because it has the shortest wavelength and slowest speed in glass.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Red light, because red has the highest energy.',
          isCorrect: false,
          misconceptionExplanation:
            'Red has the longest wavelength and highest speed in glass, giving it the lowest refractive index and minimum deviation.',
        },
        {
          id: 'p3',
          text: 'Green light, because it lies in the middle of VIBGYOR.',
          isCorrect: false,
          misconceptionExplanation:
            'Deviation increases monotonically across the spectrum from red to violet.',
        },
      ],
      correctExplanation:
        'Refractive index of glass is highest for violet light (n_violet ≈ 1.532) and lowest for red light (n_red ≈ 1.514). By Snell’s law, violet light suffers the greatest refraction and deviation at both prism faces, emerging at the bottom of the VIBGYOR spectrum.',
      relevantFormula: 'D_{\\text{violet}} > D_{\\text{indigo}} > D_{\\text{blue}} > \\dots > D_{\\text{red}}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Atmospheric Rainbow Formation',
        description: 'Suspended water droplets act like tiny spherical prisms, combining refraction, dispersion, and internal reflection.',
      },
      {
        title: 'Prism Spectrometers & Chemical Identification',
        description: 'Astronomers disperse stellar light to identify elemental emission lines of distant stars.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-atmospheric-refraction-scattering',
    title: 'Atmospheric Refraction & Rayleigh Light Scattering',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Twinkling of stars, 2-minute advanced sunrise, blue sky, and crimson red sunsets',
    description:
      'Atmospheric Refraction occurs because Earth’s atmosphere has optical density that increases continuously towards the surface (cooler, denser air at sea level has higher refractive index than warm, thinner upper layers): (1) Twinkling of Stars: Point-sized stars pass through continuously fluctuating atmospheric layers, causing shifting apparent position and flickering intensity; (2) Advanced Sunrise & Delayed Sunset: Apparent sunrise occurs ~2 minutes before actual horizon crossing, and sunset is delayed by ~2 minutes (apparent flattening of sun disc by ~0.5°); (3) Rayleigh Scattering: Gas molecules (N₂, O₂) smaller than visible light wavelength scatter light with intensity inversely proportional to the 4th power of wavelength (I ∝ 1/λ⁴). Blue light (short λ) is scattered 10x more than red, illuminating the sky blue. At sunrise and sunset, sunlight travels through thick atmospheric paths; blue light is scattered away, leaving long-wavelength red/orange light to reach our eyes directly.',
    formulaLaTeX: 'I_{\\text{scattered}} \\propto \\frac{1}{\\lambda^4} \\quad | \\quad \\Delta t_{\\text{sunrise/sunset}} \\approx 2\\text{ min}',
    formulaExplanation:
      'Rayleigh’s Scattering Law shows that blue light (λ ≈ 400 nm) scatters (700/400)⁴ ≈ 9.4 times more strongly than red light (λ ≈ 700 nm), painting the daytime sky blue.',
    variables: [
      {
        id: 'atmosphericPathLengthKm',
        name: 'Atmospheric Path Length',
        symbol: 'L',
        unit: 'km',
        min: 10,
        max: 300,
        step: 20,
        defaultValue: 20,
        description: 'Optical distance traveled through atmosphere (short at noon, long at sunset).',
      },
      {
        id: 'particleSizeNm',
        name: 'Scattering Molecule Size',
        symbol: 'd',
        unit: 'nm',
        min: 0.1,
        max: 5,
        step: 0.5,
        defaultValue: 0.3,
        description: 'Gas molecule diameter (N₂, O₂ ~ 0.3 nm << visible light wavelength).',
      },
    ],
    prediction: {
      prompt: 'Why do astronauts in orbit or on the Moon observe the sky as pitch black instead of blue?',
      scenario: 'An astronaut looks up from the lunar surface into space during lunar daytime.',
      choices: [
        {
          id: 'p1',
          text: 'There is no atmosphere on the Moon to scatter sunlight into the observer’s eyes.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Sunlight cannot reach the Moon during daytime.',
          isCorrect: false,
          misconceptionExplanation:
            'Sunlight shines brightly on the Moon; however, without gas molecules, no photons are scattered laterally into the eyes.',
        },
        {
          id: 'p3',
          text: 'Moon rocks absorb 100% of visible blue light.',
          isCorrect: false,
          misconceptionExplanation:
            'Sky color depends on Rayleigh scattering by suspended atmospheric gas molecules, which the Moon completely lacks.',
        },
      ],
      correctExplanation:
        'The blue daytime sky on Earth is caused by Rayleigh scattering of sunlight by nitrogen and oxygen molecules in the atmosphere. Since the Moon and outer space have no atmosphere, no light is scattered into the line of sight; space appears completely black except for directly viewed luminous bodies.',
      relevantFormula: 'I_{\\text{scatter}} = 0 \\quad (\\text{In vacuum where particle density } N = 0)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Red Danger Signal Lights',
        description: 'Red light scatters the least by fog and smoke particles (longest λ), making hazard signals visible from the greatest distance.',
      },
      {
        title: 'Extended Daylight Hours',
        description: 'Atmospheric refraction extends usable daytime illumination by ~4 minutes every day (2 min morning + 2 min evening).',
      },
    ],
    simulationType: 'class10-physics',
  },

  // =========================================================================
  // CHAPTER: ELECTRICITY
  // =========================================================================
  {
    id: 'ncert10-phy-electric-current-circuit-potential',
    title: 'Electric Current, Circuit & Potential Difference',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Flow of charge I = Q/t (Amperes) driven by potential difference V = W/Q (Volts)',
    description:
      'Electric Current (I) is defined as the rate of flow of electric charges across a conductor cross-section: I = Q/t. The SI unit is the Ampere (A), where 1 A = 1 C/s. By convention, electric current flows from positive terminal to negative terminal, which is opposite to the drift direction of negative electrons. Electric Potential Difference (V) between two points is the work done (W) in moving a unit positive charge from one point to the other: V = W/Q. The SI unit is the Volt (V), where 1 V = 1 J/C. A continuous closed conducting path through which electric current flows is an Electric Circuit. Ammeters (very low resistance) are always connected in SERIES to measure current. Voltmeters (very high resistance) are always connected in PARALLEL across the component to measure potential drop.',
    formulaLaTeX: 'I = \\frac{Q}{t} = \\frac{n \\cdot e}{t} \\quad | \\quad V = \\frac{W}{Q}',
    formulaExplanation:
      'Charge Q consists of an integral number of electrons (Q = ne, where elementary charge e = 1.6 x 10^-19 C). One Coulomb corresponds to the charge of 6.25 x 10^18 electrons. Potential difference V delivers the electrostatic push.',
    variables: [
      {
        id: 'potentialDifferenceV',
        name: 'Battery Voltage (V)',
        symbol: 'V',
        unit: 'V',
        min: 1.5,
        max: 24,
        step: 1.5,
        defaultValue: 12,
        description: 'Electric potential difference maintained across the circuit.',
      },
      {
        id: 'chargeDeliveredCoulombs',
        name: 'Charge Transferred (Q)',
        symbol: 'Q',
        unit: 'C',
        min: 10,
        max: 500,
        step: 10,
        defaultValue: 120,
        description: 'Total charge moved through circuit conductor.',
      },
    ],
    prediction: {
      prompt: 'If a current of 0.5 A flows through an incandescent lamp for 10 minutes, how much electric charge passes through the filament?',
      scenario: 'Current I = 0.5 A, time t = 10 minutes = 600 seconds.',
      choices: [
        {
          id: 'p1',
          text: 'Q = 300 Coulombs (equal to 1.875 × 10²¹ electrons).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Q = 5 Coulombs.',
          isCorrect: false,
          misconceptionExplanation:
            'Time must be converted from minutes to SI seconds! t = 10 × 60 = 600 s. Multiplying 0.5 by 10 forgets the unit conversion.',
        },
        {
          id: 'p3',
          text: 'Q = 1200 Coulombs.',
          isCorrect: false,
          misconceptionExplanation:
            'Q = I × t = 0.5 A × 600 s = 300 C.',
        },
      ],
      correctExplanation:
        'Q = I * t. Converting time into SI seconds: t = 10 * 60 s = 600 s. Thus Q = 0.5 A * 600 s = 300 Coulombs. Number of electrons n = Q/e = 300 / (1.6 * 10^-19) = 1.875 * 10^21 electrons.',
      relevantFormula: 'Q = I \\cdot t = 0.5\\text{ A} \\times 600\\text{ s} = 300\\text{ C}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Smartphone Battery Capacity (mAh)',
        description: 'A 5000 mAh battery delivers 5 A for 1 hour, storing Q = 5 A * 3600 s = 18,000 Coulombs of chemical charge.',
      },
      {
        title: 'Cardiac Defibrillators',
        description: 'Discharging 200 Joules across 2000 Volts transfers Q = W/V = 0.1 C in milliseconds to reset irregular cardiac fibrillation.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-ohms-law-resistance-factors',
    title: 'Ohm’s Law & Factors Affecting Electrical Resistance',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'V = IR & R = ρ(l / A): Length, Cross-Sectional Area, Material Resistivity & Temperature',
    description:
      'Ohm’s Law states that the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) applied across its ends, provided temperature and physical dimensions remain constant: V ∝ I => V = IR. The constant of proportionality R is Electrical Resistance (unit: Ohm Ω). Factors affecting resistance of a uniform conductor: (1) Directly proportional to length (R ∝ l) — doubling length doubles electron collisions; (2) Inversely proportional to area of cross-section (R ∝ 1/A) — thicker wire offers more parallel pathways; (3) Nature of material (Resistivity ρ in Ω·m): Metals (copper, aluminum ~10^-8 Ω·m) are excellent conductors; Alloys (nichrome ~10^-6 Ω·m) have 60x higher resistivity and do not oxidize at red-hot temperatures (used in heaters); Insulators (rubber, glass ~10^12 to 10^17 Ω·m).',
    formulaLaTeX: 'V = I R \\quad | \\quad R = \\rho \\frac{l}{A} = \\rho \\frac{l}{\\pi r^2}',
    formulaExplanation:
      'Resistance R depends linearly on conductor length l, inversely on cross-sectional area A, and on material resistivity ρ. Ohm’s Law V = IR shows constant linear slope on a V-I graph.',
    variables: [
      {
        id: 'conductorLengthM',
        name: 'Conductor Length (l)',
        symbol: 'l',
        unit: 'm',
        min: 0.5,
        max: 10,
        step: 0.5,
        defaultValue: 2,
        description: 'Length of metallic wire.',
      },
      {
        id: 'conductorAreaMm2',
        name: 'Cross-Section Area (A)',
        symbol: 'A',
        unit: 'mm²',
        min: 0.2,
        max: 5.0,
        step: 0.2,
        defaultValue: 1.0,
        description: 'Cross-sectional thickness of the wire.',
      },
      {
        id: 'appliedVoltageV',
        name: 'Applied Voltage (V)',
        symbol: 'V',
        unit: 'V',
        min: 1,
        max: 24,
        step: 1,
        defaultValue: 12,
        description: 'Potential difference driving current through wire.',
      },
    ],
    prediction: {
      prompt: 'A cylindrical wire of resistance R is stretched uniformly until its length is doubled (l\' = 2l). What is its new resistance?',
      scenario: 'The wire is drawn through a wire-drawing die. Volume of metal remains strictly constant (V = l * A).',
      choices: [
        {
          id: 'p1',
          text: 'New resistance is 4R (quadrupled).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'New resistance is 2R (doubled).',
          isCorrect: false,
          misconceptionExplanation:
            'When a wire is stretched to double its length, its cross-sectional area simultaneously halves (A\' = A/2) because volume is conserved! Both changes increase resistance: 2 / (1/2) = 4.',
        },
        {
          id: 'p3',
          text: 'New resistance remains R.',
          isCorrect: false,
          misconceptionExplanation:
            'Resistance depends on both geometry (l and A) and material.',
        },
      ],
      correctExplanation:
        'Since volume V = l * A is constant, doubling length (l\' = 2l) halves the cross-sectional area (A\' = A/2). New resistance R\' = ρ(l\'/A\') = ρ(2l / (A/2)) = 4 * ρ(l/A) = 4R.',
      relevantFormula: 'R\' = \\rho \\frac{2l}{A/2} = 4 \\cdot \\rho \\frac{l}{A} = 4R',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Overhead Electric Transmission Cables',
        description: 'Thick stranded aluminum cables (large A) minimize resistance R to prevent transmission power loss over hundreds of kilometers.',
      },
      {
        title: 'Nichrome Heating Coils in Toasters',
        description: 'High resistivity alloy Nichrome (ρ ~ 1.1 x 10^-6 Ω·m) produces intense Joule heating without melting or oxidizing at red heat.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-series-parallel-circuits',
    title: 'Resistors in Series & Parallel Circuit Analysis',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Series (Rs = R1 + R2, constant I) vs Parallel (1/Rp = 1/R1 + 1/R2, constant V)',
    description:
      'Two fundamental resistor configurations: (1) Series Combination: Resistors joined end-to-end. Current (I) is identical through every resistor. Total potential difference V divides: V = V1 + V2 + V3. Equivalent resistance Rs = R1 + R2 + R3 (always greater than the largest individual resistor). Disadvantages: if one component burns out, the entire open circuit fails; components cannot be operated independently; (2) Parallel Combination: Resistors connected simultaneously across two common nodes. Potential difference (V) is identical across every branch. Total current divides: I = I1 + I2 + I3. Equivalent resistance 1/Rp = 1/R1 + 1/R2 + 1/R3 (always smaller than the smallest individual resistor). Domestic household circuits are strictly wired in parallel so that every appliance receives full 220 V voltage and operates independently with its own switch.',
    formulaLaTeX: 'R_s = R_1 + R_2 + R_3 \\quad | \\quad \\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}',
    formulaExplanation:
      'In series, resistances sum up directly. In parallel, reciprocal equivalent resistance equals the sum of reciprocals, reducing overall resistance.',
    variables: [
      {
        id: 'resistorR1',
        name: 'Resistor R₁',
        symbol: 'R_1',
        unit: 'Ω',
        min: 2,
        max: 50,
        step: 2,
        defaultValue: 10,
        description: 'Resistance of branch 1.',
      },
      {
        id: 'resistorR2',
        name: 'Resistor R₂',
        symbol: 'R_2',
        unit: 'Ω',
        min: 2,
        max: 50,
        step: 2,
        defaultValue: 20,
        description: 'Resistance of branch 2.',
      },
      {
        id: 'circuitMode',
        name: 'Connection Topology',
        symbol: 'Type',
        unit: 'mode',
        min: 1,
        max: 2,
        step: 1,
        defaultValue: 2,
        description: '1 = Series, 2 = Parallel.',
      },
    ],
    prediction: {
      prompt: 'Two resistors of 10 Ω and 20 Ω are connected in parallel across a 12 V battery. What is the equivalent resistance of the circuit?',
      scenario: 'Parallel branch: 1/Rp = 1/10 + 1/20 = 3/20.',
      choices: [
        {
          id: 'p1',
          text: 'Rp = 6.67 Ω (smaller than both 10 Ω and 20 Ω).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Rp = 30 Ω.',
          isCorrect: false,
          misconceptionExplanation:
            '30 Ω is the series sum (Rs = 10 + 20). In parallel, adding extra pathways always reduces net resistance.',
        },
        {
          id: 'p3',
          text: 'Rp = 15 Ω (the average).',
          isCorrect: false,
          misconceptionExplanation:
            'Parallel combination uses reciprocal addition: Rp = (R1 * R2) / (R1 + R2) = (10 * 20) / (10 + 20) = 200/30 = 6.67 Ω.',
        },
      ],
      correctExplanation:
        '1/Rp = 1/R1 + 1/R2 = 1/10 + 1/20 = 3/20 Ω^-1. Therefore Rp = 20/3 = 6.67 Ω. In parallel arrangements, the equivalent resistance is always strictly less than the smallest individual resistance.',
      relevantFormula: 'R_p = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{10 \\times 20}{10 + 20} = \\frac{200}{30} \\approx 6.67\\, \\Omega',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Domestic Household Appliance Wiring',
        description: 'All home wall outlets are wired in parallel so that turning off a bedroom lamp does not kill power to the refrigerator.',
      },
      {
        title: 'Holiday Decorative Fairy Lights',
        description: 'Cheap series strings fail entirely if a single bulb blows, whereas parallel strings stay illuminated.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-joule-heating-electric-power',
    title: 'Joule’s Heating Effect, Electric Fuse & Power Consumption',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'H = I²Rt: Thermal dissipation, tungsten filaments, fuse protection & commercial kWh billing',
    description:
      'Joule’s Law of Heating states that heat (H) produced in a resistor is: (1) Directly proportional to the square of current (H ∝ I²); (2) Directly proportional to resistance (H ∝ R); (3) Directly proportional to the time for which current flows (H ∝ t): H = I²Rt = VIt = (V²/R)t. Practical Applications: (a) Electric heating appliances (geysers, heaters) employ high-resistivity Nichrome coils; (b) Electric bulbs use high-melting-point tungsten filaments (m.p. 3380°C) sealed in inert argon/nitrogen gas; (c) Electric Fuse: Safety device made of lead-tin alloy having low melting point. When excessive current flows due to short-circuiting or overloading, Joule heating melts the fuse wire, breaking the circuit; (d) Electric Power (P): Rate of electrical energy consumption: P = VI = I²R = V²/R (unit: Watt W). Commercial unit of electrical energy: 1 kilowatt-hour (1 kWh = 1 Board of Trade Unit = 3.6 x 10^6 J).',
    formulaLaTeX: 'H = I^2 R t \\quad | \\quad P = V I = \\frac{V^2}{R} \\quad | \\quad 1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}',
    formulaExplanation:
      'Doubling current quadruples Joule heat dissipation (I² dependence). Power P measures rate of energy consumption in Watts (1 W = 1 J/s). Monthly electricity meters track billing in kilowatt-hours (kWh).',
    variables: [
      {
        id: 'circuitCurrentAmps',
        name: 'Current (I)',
        symbol: 'I',
        unit: 'A',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 5,
        description: 'Current passing through heating element.',
      },
      {
        id: 'elementResistanceOhms',
        name: 'Resistance (R)',
        symbol: 'R',
        unit: 'Ω',
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 40,
        description: 'Resistance of the heating element.',
      },
      {
        id: 'heatingDurationMin',
        name: 'Duration (t)',
        symbol: 't',
        unit: 'min',
        min: 1,
        max: 60,
        step: 5,
        defaultValue: 10,
        description: 'Operating time.',
      },
    ],
    prediction: {
      prompt: 'If current flowing through a fixed heating coil is doubled, by what factor does the heat generated per second increase?',
      scenario: 'A room heater coil operating on 5 A is stepped up to draw 10 A.',
      choices: [
        {
          id: 'p1',
          text: 'Heat generated increases by a factor of 4 (quadruples).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Heat generated doubles (increases by factor of 2).',
          isCorrect: false,
          misconceptionExplanation:
            'Joule’s law states H ∝ I² (square of current), not linear with current.',
        },
        {
          id: 'p3',
          text: 'Heat generated increases by a factor of 8.',
          isCorrect: false,
          misconceptionExplanation:
            '(2I)² = 4I², so the rate of heat production increases exactly by 4.',
        },
      ],
      correctExplanation:
        'By Joule’s Law of Heating, thermal energy dissipated per unit time is P = I²R. If current I is doubled to 2I, P\' = (2I)²R = 4I²R = 4P. Thermal output quadruples.',
      relevantFormula: 'H \\propto I^2 \\implies (2I)^2 = 4I^2',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Household Electric Meter Utility Bills',
        description: 'Electricity consumption is billed in "units", where 1 unit = 1 kWh = energy consumed by a 1000 W appliance run for 1 hour.',
      },
      {
        title: 'Cartridge Fuse Protection',
        description: 'A 5 A fuse wire immediately melts when an air conditioner short circuit draws 20 A, safeguarding home wiring from fire.',
      },
    ],
    simulationType: 'class10-physics',
  },

  // =========================================================================
  // CHAPTER: MAGNETIC EFFECTS OF ELECTRIC CURRENT
  // =========================================================================
  {
    id: 'ncert10-phy-magnetic-field-lines-straight-wire',
    title: 'Magnetic Field Lines & Right-Hand Thumb Rule',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Oersted’s experiment & Maxwell’s Right-Hand Thumb Rule for straight current-carrying conductors',
    description:
      'In 1820, Hans Christian Oersted discovered that an electric current deflects a magnetic compass needle, proving electricity and magnetism are unified. Magnetic Field Lines represent the force trajectory: (1) Emerge from North pole and enter South pole outside a magnet; form continuous closed loops inside from South to North; (2) Degree of closeness indicates field strength; (3) Two magnetic field lines NEVER intersect (if they did, a compass at the intersection point would point in two different directions simultaneously, which is physically impossible). For a straight current-carrying conductor: Magnetic field lines form concentric circles centered on the wire. Right-Hand Thumb Rule (Maxwell’s Corkscrew Rule): Imagine holding a current-carrying straight conductor in your right hand with the outstretched thumb pointing in the direction of electric current; then your curled fingers encircle the wire in the direction of the magnetic field lines.',
    formulaLaTeX: 'B = \\frac{\\mu_0 I}{2 \\pi r} \\quad | \\quad B \\propto I, \\quad B \\propto \\frac{1}{r}',
    formulaExplanation:
      'Magnetic field strength B is directly proportional to current I and inversely proportional to radial distance r from the wire axis.',
    variables: [
      {
        id: 'wireCurrentAmps',
        name: 'Wire Current (I)',
        symbol: 'I',
        unit: 'A',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 10,
        description: 'Electric current flowing through vertical wire.',
      },
      {
        id: 'radialDistanceCm',
        name: 'Radial Distance (r)',
        symbol: 'r',
        unit: 'cm',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 5,
        description: 'Distance from wire to observation compass needle.',
      },
    ],
    prediction: {
      prompt: 'If electric current in a vertical wire flows downwards towards the floor, what is the direction of concentric magnetic field lines when viewed from above?',
      scenario: 'Applying Maxwell’s Right-Hand Thumb Rule looking down at the tabletop.',
      choices: [
        {
          id: 'p1',
          text: 'Clockwise direction.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Anticlockwise direction.',
          isCorrect: false,
          misconceptionExplanation:
            'Point your right thumb downwards towards the floor; your fingers curl in the clockwise direction.',
        },
        {
          id: 'p3',
          text: 'Straight radial lines pointing outward like sun rays.',
          isCorrect: false,
          misconceptionExplanation:
            'Magnetic field lines around straight conductors are always concentric circles, not straight radial lines.',
        },
      ],
      correctExplanation:
        'Using the Right-Hand Thumb Rule: Point the right thumb downwards (direction of electric current). The curled fingers curl in the clockwise direction when viewed from above.',
      relevantFormula: '\\vec{B} \\text{ circles clockwise for } \\vec{I} \\text{ pointing downwards}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'High-Voltage Power Line Compass Deflection',
        description: 'Hikers under high-voltage DC transmission lines observe compass needle errors caused by surrounding circular magnetic fields.',
      },
      {
        title: 'Coaxial Cable Magnetic Shielding',
        description: 'Equal and opposite return currents in coaxial conductors cancel surrounding external magnetic interference.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-solenoid-electromagnet',
    title: 'Magnetic Field in a Solenoid & Electromagnets',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Uniform axial magnetic field inside a coil: B = μ₀ n I & Soft iron core electromagnets',
    description:
      'A Solenoid is a cylindrical coil of many circular turns of insulated copper wire wrapped closely in the shape of a cylinder. When an electric current flows through a solenoid: (1) The magnetic field pattern outside resembles that of a bar magnet, with one end behaving as an attractive North magnetic pole and the other as a South magnetic pole; (2) INSIDE the solenoid, magnetic field lines are parallel straight lines along the cylinder axis, meaning the magnetic field is completely UNIFORM and strong at all interior points; (3) Electromagnet: A strong magnetic field produced inside a solenoid can be used to magnetize a piece of magnetic material, such as a soft iron rod placed inside the coil. Soft iron has high magnetic permeability and loses its magnetism the instant current is switched off (temporary magnet). Steel retains magnetism to form permanent magnets.',
    formulaLaTeX: 'B = \\mu_0 n I = \\mu_0 \\left(\\frac{N}{L}\\right) I',
    formulaExplanation:
      'Magnetic field B inside an ideal long solenoid depends on permeability μ0, number of turns per unit length n = N/L, and electric current I.',
    variables: [
      {
        id: 'turnsCountN',
        name: 'Number of Turns (N)',
        symbol: 'N',
        unit: 'turns',
        min: 50,
        max: 1000,
        step: 50,
        defaultValue: 400,
        description: 'Total turns of insulated copper wire on solenoid.',
      },
      {
        id: 'coilCurrentAmps',
        name: 'Coil Current (I)',
        symbol: 'I',
        unit: 'A',
        min: 0.5,
        max: 10,
        step: 0.5,
        defaultValue: 3,
        description: 'Current through solenoid windings.',
      },
    ],
    prediction: {
      prompt: 'What happens to the magnetic field strength inside a solenoid if a soft iron core is inserted into its hollow center?',
      scenario: 'An air-core solenoid carries 2 A of current. A soft iron cylinder is slipped into the core.',
      choices: [
        {
          id: 'p1',
          text: 'Magnetic field strength increases by several hundred to thousand times.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Magnetic field drops to zero because iron absorbs magnetic lines.',
          isCorrect: false,
          misconceptionExplanation:
            'Soft iron is ferromagnetic with huge relative magnetic permeability (μ_r ~ 1000-5000), intensely concentrating magnetic flux.',
        },
        {
          id: 'p3',
          text: 'Magnetic field remains identical.',
          isCorrect: false,
          misconceptionExplanation:
            'Field in a core is B = μ_r * μ_0 * n * I, amplified by the relative permeability factor.',
        },
      ],
      correctExplanation:
        'Soft iron has high relative magnetic permeability (μ_r >> 1). Its magnetic domains align with the solenoid field, multiplying magnetic flux density by hundreds of times to produce a powerful electromagnet.',
      relevantFormula: 'B_{\\text{iron}} = \\mu_r \\cdot B_{\\text{air}} \\quad (\\mu_r \\sim 1000)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Industrial Scrap Metal Cranes',
        description: 'Giant electromagnets lift scrap iron and steel cars, releasing them instantly when current is switched off.',
      },
      {
        title: 'Electric Bells & Magnetic Door Locks (Maglocks)',
        description: 'Electromagnets pull striker armatures to ring bells or secure building access doors.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-fleming-left-hand-electric-motor',
    title: 'Fleming’s Left-Hand Rule & Electric Motor Principle',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Converting electrical energy to mechanical rotation: F = BIL sin(θ), split-ring commutator & brushes',
    description:
      'When a current-carrying conductor is placed in a magnetic field, it experiences a mechanical force perpendicular to both the field and the current (discovered by André-Marie Ampère). Fleming’s Left-Hand Rule: Stretch the thumb, forefinger, and middle finger of your left hand mutually perpendicular to each other: (1) Forefinger points in direction of Magnetic Field (N -> S); (2) Middle finger points in direction of Current (+ -> -); (3) Thumb points in direction of Motion / mechanical Force. Electric Motor (DC Motor): A rotating device converting electrical energy into mechanical rotational kinetic energy: (a) Armature coil ABCD placed between opposite magnetic poles; (b) Split-ring Commutator (split copper rings P and Q) reverses current direction through the coil every half rotation, ensuring continuous unidirectional torque rotation; (c) Carbon Brushes maintain sliding electrical contact with rotating split rings.',
    formulaLaTeX: 'F = B I L \\sin\\theta \\quad | \\quad \\tau = N B I A \\sin\\theta',
    formulaExplanation:
      'Mechanical force F on a conductor of length L carrying current I in magnetic field B. Force is maximum when conductor is perpendicular to field (θ = 90°). Torque τ drives continuous motor rotation.',
    variables: [
      {
        id: 'magneticFieldB',
        name: 'Magnetic Field (B)',
        symbol: 'B',
        unit: 'T',
        min: 0.1,
        max: 2.0,
        step: 0.1,
        defaultValue: 0.8,
        description: 'Magnetic field between permanent N and S pole shoes.',
      },
      {
        id: 'armatureCurrentI',
        name: 'Armature Current (I)',
        symbol: 'I',
        unit: 'A',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 4,
        description: 'DC current delivered to motor windings through carbon brushes.',
      },
    ],
    prediction: {
      prompt: 'What is the essential function of the split-ring commutator in an electric motor?',
      scenario: 'Armature coil ABCD completes half a rotation (180° turn) between magnet poles.',
      choices: [
        {
          id: 'p1',
          text: 'It reverses the direction of current in the coil every half rotation to sustain unidirectional torque.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'It prevents the motor from overheating.',
          isCorrect: false,
          misconceptionExplanation:
            'Thermal control is handled by ventilation fins or fans, not the commutator.',
        },
        {
          id: 'p3',
          text: 'It converts mechanical energy into electrical energy.',
          isCorrect: false,
          misconceptionExplanation:
            'A motor converts electrical energy into mechanical energy. A generator converts mechanical into electrical.',
        },
      ],
      correctExplanation:
        'Without a commutator, after rotating 180°, the force on arms AB and CD would reverse, oscillating the coil back and forth. The split-ring commutator reverses the current every half-turn, ensuring the couple torque always acts in the same rotational sense (continuous rotation).',
      relevantFormula: '\\text{Commutator reverses current } I \\implies \\text{Continuous unidirectional } \\tau',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Electric Vehicles (EVs) & Hybrid Propulsion',
        description: 'Electric motors convert battery chemical energy into clean wheel rotational drive with >90% efficiency.',
      },
      {
        title: 'Household Electric Fans, Blenders & Hard Drives',
        description: 'High-speed DC and brushless electric motors power ceiling fans, blenders, and computer cooling fans.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-electromagnetic-induction-fleming-right',
    title: 'Electromagnetic Induction & Fleming’s Right-Hand Rule',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Faraday’s discovery: Relative motion between coil & magnet induces electric current without battery',
    description:
      'In 1831, Michael Faraday discovered Electromagnetic Induction (EMI): The phenomenon of generating an induced electric current in a closed circuit whenever the magnetic flux linked with the circuit changes with time. Faraday’s Observations: (1) Moving a bar magnet rapidly into a stationary coil deflects a galvanometer needle; (2) Holding magnet stationary inside coil produces zero deflection (motion is mandatory); (3) Moving magnet out deflects galvanometer in the opposite direction; (4) Rapid motion induces greater current. Fleming’s Right-Hand Rule (Generator Rule): Stretch thumb, forefinger, and middle finger of right hand mutually perpendicular: (a) Forefinger = Magnetic Field direction; (b) Thumb = Motion of conductor; (c) Middle finger = Induced Current direction. AC vs DC: Direct Current (DC) flows unidirectionally (batteries). Alternating Current (AC) reverses direction periodically (household 220 V at 50 Hz in India, changing polarity every 1/100 s).',
    formulaLaTeX: '\\mathcal{E} = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d(B \\cdot A \\cos\\theta)}{dt}',
    formulaExplanation:
      'Faraday’s Law of EMI: Induced electromotive force (EMF) is proportional to the time rate of change of magnetic flux (Φ_B = B · A). Minus sign (Lenz’s Law) indicates induced current opposes the flux change that produced it.',
    variables: [
      {
        id: 'magnetSpeedMPerS',
        name: 'Magnet Relative Speed',
        symbol: 'v',
        unit: 'm/s',
        min: 0,
        max: 5,
        step: 0.5,
        defaultValue: 2,
        description: 'Speed of bar magnet moving through hollow coil.',
      },
      {
        id: 'coilTurnsN',
        name: 'Coil Turns (N)',
        symbol: 'N',
        unit: 'turns',
        min: 100,
        max: 1000,
        step: 100,
        defaultValue: 500,
        description: 'Number of turns of copper wire on induction bobbin.',
      },
    ],
    prediction: {
      prompt: 'A bar magnet is held completely stationary inside a coil connected to a sensitive galvanometer. What is the galvanometer deflection?',
      scenario: 'Magnet resides in center of coil with zero relative motion (v = 0).',
      choices: [
        {
          id: 'p1',
          text: 'Zero deflection (no current is induced).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Maximum steady deflection to the right.',
          isCorrect: false,
          misconceptionExplanation:
            'A static magnetic field induces zero EMF. Electromagnetic induction strictly requires a changing magnetic flux (dΦ/dt != 0).',
        },
        {
          id: 'p3',
          text: 'Oscillating deflection back and forth continuously.',
          isCorrect: false,
          misconceptionExplanation:
            'Without relative motion, flux is static; no energy can be generated from nothing (conservation of energy).',
        },
      ],
      correctExplanation:
        'Induced EMF requires a changing magnetic flux: E = -N(dΦ/dt). When the magnet is stationary, magnetic flux through the coil is constant, so dΦ/dt = 0. No current is induced and the galvanometer needle rests at zero.',
      relevantFormula: '\\frac{d\\Phi_B}{dt} = 0 \\implies \\mathcal{E} = 0, \\quad I_{\\text{induced}} = 0',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Hydroelectric & Thermal Power Plant Alternators',
        description: 'Gigawatt turbines spin giant magnetic rotors inside stator coils to generate national AC grid power.',
      },
      {
        title: 'Bicycle Dynamos & Wireless Smartphone Charging',
        description: 'Bicycle wheels spin magnets past coils to power headlights; wireless charging pads induce current into phone receiver coils.',
      },
    ],
    simulationType: 'class10-physics',
  },
  {
    id: 'ncert10-phy-domestic-electric-circuits-safety',
    title: 'Domestic Electric Circuits: Live, Neutral, Earth & Safety Earthing',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: '220 V 50 Hz AC, Live (Red), Neutral (Black), Earth (Green) wire safety & Fuse / MCB tripping',
    description:
      'Electric power supplied to homes in India is Alternating Current (AC) at 220 V potential difference with a frequency of 50 Hz. Household wiring consists of three colored insulated wires: (1) Live Wire (Phase): Red or brown insulation, maintains +220 V potential; (2) Neutral Wire: Black or light blue insulation, maintains 0 V ground reference; (3) Earth Wire: Green or yellow-green insulation, connected to a metal plate buried deep in the ground near the house. Safety Earthing: Metal casings of electrical appliances (refrigerator, toaster, iron) are connected to the Earth wire. If faulty insulation causes live wire to touch the metal casing, current immediately flows through the low-resistance earth wire into the ground rather than through a user touching the body, preventing fatal electrical shocks. Short-Circuit occurs when live and neutral wires touch directly (resistance R -> 0), causing huge surge currents that melt wires. Overloading occurs when too many high-power appliances operate simultaneously on a single socket.',
    formulaLaTeX: 'V_{\\text{live}} - V_{\\text{neutral}} = 220\\text{ V} \\quad | \\quad f = 50\\text{ Hz} \\quad | \\quad I_{\\text{short}} = \\frac{V}{R \\to 0} \\to \\infty',
    formulaExplanation:
      'Potential difference across live and neutral is 220 V. Earthing provides a zero-resistance safety path so leaking current trips the fuse / Miniature Circuit Breaker (MCB).',
    variables: [
      {
        id: 'safetyFuseRatingAmps',
        name: 'Fuse Rating',
        symbol: 'I_{\\text{fuse}}',
        unit: 'A',
        min: 5,
        max: 30,
        step: 5,
        defaultValue: 15,
        description: 'Current rating of circuit protective fuse/MCB.',
      },
      {
        id: 'connectedLoadWatts',
        name: 'Total Connected Power Load',
        symbol: 'P_{\\text{load}}',
        unit: 'W',
        min: 500,
        max: 5000,
        step: 250,
        defaultValue: 2200,
        description: 'Power drawn by connected appliances (I = P / 220 V).',
      },
    ],
    prediction: {
      prompt: 'An electric iron of power 1100 W is connected to a 220 V domestic circuit. What rating fuse should be installed in this circuit branch?',
      scenario: 'Calculated current: I = P / V = 1100 W / 220 V = 5.0 A.',
      choices: [
        {
          id: 'p1',
          text: 'A 5 A or 6 A fuse.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'A 1 A fuse.',
          isCorrect: false,
          misconceptionExplanation:
            'A 1 A fuse would melt immediately upon turning on the iron, as normal operating current is 5 A.',
        },
        {
          id: 'p3',
          text: 'A 50 A fuse.',
          isCorrect: false,
          misconceptionExplanation:
            'A 50 A fuse would fail to protect the appliance or wiring; dangerous fault currents could cause an electrical fire without tripping the fuse.',
        },
      ],
      correctExplanation:
        'Normal operating current I = P/V = 1100 W / 220 V = 5.0 A. To permit normal operation while safeguarding against dangerous overloads or short circuits, a fuse rated slightly above or at 5 A (e.g. 5 A or 6 A fuse) must be used.',
      relevantFormula: 'I = \\frac{P}{V} = \\frac{1100\\text{ W}}{220\\text{ V}} = 5\\text{ A}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: '3-Pin Power Plugs in High-Wattage Appliances',
        description: 'The longer, thicker top pin connects the Earth wire first before live and neutral pins engage, ensuring instant safety grounding.',
      },
      {
        title: 'Miniature Circuit Breakers (MCBs)',
        description: 'Electromagnetic switches trip open within 3 milliseconds during short circuits and can be reset without replacing burnt wires.',
      },
    ],
    simulationType: 'class10-physics',
  },

  // =========================================================================
  // CHAPTER: SOURCES OF ENERGY (PHYSICS)
  // =========================================================================
  {
    id: 'ncert10-phy-sources-of-energy-renewable',
    title: 'Conventional & Renewable Sources of Energy',
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Hydroelectric (P = ρghQ), Wind (P = ½ρAv³), Solar Photovoltaics & Nuclear Fission (E = Δmc²)',
    description:
      'Energy Sources in Physics: (1) Hydroelectric Power: Kinetic energy of falling dam water spins turbines: P = ρghQ. Renewable with zero greenhouse gas emissions, though requiring submergence of agricultural land; (2) Wind Energy: Wind kinetic energy rotates blades: P = ½ρAv³. Wind farms require wind speeds > 15 km/h and large land area (2 hectares per MW); (3) Solar Energy: Solar constant = 1.4 kW/m² at outer atmosphere. Solar cells made of high-purity silicon generate ~0.5–1 V and 0.7 W power, combined into solar panels; (4) Nuclear Fission: Heavy nucleus (U-235) struck by a thermal neutron splits into barium and krypton, releasing 200 MeV energy per fission due to mass defect (E = Δmc²). One ton of uranium generates energy equivalent to 3 million tons of coal.',
    formulaLaTeX: 'P_{\\text{hydro}} = \\rho g h Q \\quad | \\quad P_{\\text{wind}} = \\frac{1}{2} \\rho A v^3 \\quad | \\quad E = \\Delta m \\cdot c^2',
    formulaExplanation:
      'Wind power increases with the cube of wind velocity (v³). Nuclear energy converts relativistic mass defect Δm into energy via Einstein’s E = Δmc².',
    variables: [
      {
        id: 'windSpeedMPerS',
        name: 'Wind Velocity (v)',
        symbol: 'v',
        unit: 'm/s',
        min: 2,
        max: 25,
        step: 1,
        defaultValue: 10,
        description: 'Wind speed blowing through wind turbine blades.',
      },
      {
        id: 'damHeightH',
        name: 'Hydro Dam Head (h)',
        symbol: 'h',
        unit: 'm',
        min: 20,
        max: 250,
        step: 10,
        defaultValue: 100,
        description: 'Vertical water head in hydroelectric dam.',
      },
    ],
    prediction: {
      prompt: 'If wind speed blowing into a wind turbine doubles from 5 m/s to 10 m/s, by what factor does the electrical power output increase?',
      scenario: 'Evaluating the cubic wind power law: P = 1/2 * rho * A * v^3.',
      choices: [
        {
          id: 'p1',
          text: 'Power output increases by a factor of 8 (2³ = 8 times).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Power output doubles (2 times).',
          isCorrect: false,
          misconceptionExplanation:
            'Kinetic energy flux through the blade swept area depends on v * (1/2 m v²) = 1/2 rho A v³, producing a cubic v³ relationship.',
        },
        {
          id: 'p3',
          text: 'Power output quadruples (4 times).',
          isCorrect: false,
          misconceptionExplanation:
            'While kinetic energy is proportional to v², the mass flow rate of air passing the blades per second is also proportional to v. Total power is proportional to v * v² = v³.',
        },
      ],
      correctExplanation:
        'Wind power is proportional to the cube of velocity: P ∝ v³. If velocity doubles (2v), power becomes (2)³ = 8 times greater. This is why wind turbines are erected in high-velocity coastal and ridge zones.',
      relevantFormula: 'P \\propto v^3 \\implies (2v)^3 = 8v^3',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Hydroelectric Pumped Storage Reservoirs',
        description: 'Water pumped to upper reservoirs during low-tariff hours is dropped through turbines during peak grid demand.',
      },
      {
        title: 'Grid-Tied Solar Rooftop Arrays',
        description: 'Silicon solar panels convert photon flux directly into DC electricity with 20% conversion efficiency.',
      },
    ],
    simulationType: 'class10-physics',
  },
];
