/* @ds-bundle: {"format":3,"namespace":"CephalosophieDesignSystem_5c2e04","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Panel","sourcePath":"components/core/Panel.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"LogEntry","sourcePath":"components/feedback/LogEntry.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"PlayerBadge","sourcePath":"components/game/PlayerBadge.jsx"},{"name":"SpeedControl","sourcePath":"components/game/SpeedControl.jsx"},{"name":"SuitSelector","sourcePath":"components/game/SuitSelector.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"ca11d2574d2d","components/core/Button.jsx":"8d7b213e6c26","components/core/Panel.jsx":"35da41d70a8e","components/core/Tabs.jsx":"15e9eb6a72df","components/feedback/LogEntry.jsx":"d98452365a0f","components/forms/Select.jsx":"73802ab4bd5a","components/game/PlayerBadge.jsx":"f07f3087ce60","components/game/SpeedControl.jsx":"b583ab551ca0","components/game/SuitSelector.jsx":"dc59e3aef5ca","ui_kits/brain_editor/BrainEditor.jsx":"b13ce60618bb","ui_kits/game_table/GameTable.jsx":"c741df582dda"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CephalosophieDesignSystem_5c2e04 = window.CephalosophieDesignSystem_5c2e04 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
const badgeColors = {
  gold: {
    bg: 'rgba(197,164,78,0.15)',
    border: 'var(--gold)',
    color: 'var(--gold-bright)'
  },
  blue: {
    bg: 'rgba(52,97,242,0.15)',
    border: 'var(--blue)',
    color: 'var(--blue-bright)'
  },
  red: {
    bg: 'rgba(217,64,64,0.15)',
    border: 'var(--red)',
    color: 'var(--red-bright)'
  },
  orange: {
    bg: 'rgba(212,138,48,0.15)',
    border: 'var(--orange)',
    color: 'var(--orange-bright)'
  },
  green: {
    bg: 'rgba(61,174,90,0.15)',
    border: 'var(--green-bright)',
    color: 'var(--green-pale)'
  },
  pink: {
    bg: 'rgba(232,64,144,0.15)',
    border: 'var(--pink)',
    color: 'var(--pink-bright)'
  },
  muted: {
    bg: 'rgba(255,255,255,0.06)',
    border: 'var(--border-default)',
    color: 'var(--fg-secondary)'
  }
};
function Badge({
  children,
  variant = 'muted',
  appearance = 'outline',
  size = 'sm',
  className
}) {
  const c = badgeColors[variant] || badgeColors.muted;
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--weight-bold)',
    lineHeight: 1,
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    ...(size === 'sm' ? {
      fontSize: '11px',
      padding: '2px 6px'
    } : {
      fontSize: '13px',
      padding: '4px 10px'
    }),
    ...(appearance === 'filled' ? {
      background: c.bg,
      color: c.color,
      border: '1px solid transparent'
    } : {
      background: 'transparent',
      color: c.color,
      border: `1px solid ${c.border}`
    })
  };
  return React.createElement('span', {
    style,
    className
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const buttonStyles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-medium)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--duration-normal) var(--ease-default)',
    whiteSpace: 'nowrap',
    lineHeight: 1
  },
  sizes: {
    sm: {
      fontSize: '13px',
      padding: '6px 14px',
      borderRadius: 'var(--radius-sm)'
    },
    md: {
      fontSize: '15px',
      padding: '10px 20px',
      borderRadius: 'var(--radius-md)'
    },
    lg: {
      fontSize: '17px',
      padding: '14px 28px',
      borderRadius: 'var(--radius-md)'
    }
  },
  variants: {
    gold: {
      background: 'var(--gold)',
      color: 'var(--fg-inverse)'
    },
    dark: {
      background: 'var(--bg-overlay)',
      color: 'var(--fg-primary)',
      border: '1px solid var(--border-default)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--fg-primary)',
      border: '1px solid var(--border-default)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--fg-secondary)',
      border: '1px solid transparent'
    }
  },
  hover: {
    gold: {
      background: 'var(--gold-bright)'
    },
    dark: {
      background: 'var(--bg-muted)'
    },
    outline: {
      borderColor: 'var(--fg-secondary)'
    },
    ghost: {
      color: 'var(--fg-primary)',
      background: 'rgba(255,255,255,0.05)'
    }
  },
  disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none'
  }
};
function Button({
  children,
  variant = 'dark',
  size = 'md',
  disabled,
  onClick,
  icon,
  fullWidth,
  className
}) {
  const [hovered, setHovered] = React.useState(false);
  const style = {
    ...buttonStyles.base,
    ...buttonStyles.sizes[size],
    ...buttonStyles.variants[variant],
    ...(hovered && !disabled ? buttonStyles.hover[variant] : {}),
    ...(disabled ? buttonStyles.disabled : {}),
    ...(fullWidth ? {
      width: '100%'
    } : {})
  };
  return React.createElement('button', {
    style,
    className,
    disabled,
    onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Panel.jsx
try { (() => {
const panelBgs = {
  raised: 'var(--bg-raised)',
  surface: 'var(--bg-surface)',
  overlay: 'var(--bg-overlay)',
  glass: 'var(--glass-bg)'
};
const panelPaddings = {
  none: '0',
  sm: '8px',
  md: '16px',
  lg: '24px'
};
const panelRadii = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)'
};
const panelGlows = {
  gold: 'var(--shadow-glow-gold)',
  blue: 'var(--shadow-glow-blue)',
  pink: 'var(--shadow-glow-pink)',
  green: 'var(--shadow-glow-green)',
  none: 'none'
};
function Panel({
  children,
  variant = 'raised',
  padding = 'md',
  radius = 'md',
  bordered = true,
  glow = 'none',
  className,
  style: extraStyle
}) {
  const style = {
    background: panelBgs[variant],
    padding: panelPaddings[padding],
    borderRadius: panelRadii[radius],
    border: bordered ? '1px solid var(--border-subtle)' : 'none',
    boxShadow: panelGlows[glow],
    ...(variant === 'glass' ? {
      backdropFilter: `blur(var(--glass-blur))`
    } : {}),
    ...extraStyle
  };
  return React.createElement('div', {
    style,
    className
  }, children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Panel.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function Tabs({
  tabs,
  activeId,
  onChange,
  className
}) {
  const tabBarStyle = {
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid var(--border-subtle)',
    fontFamily: 'var(--font-sans)'
  };
  const tabStyle = active => ({
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-normal)',
    color: active ? 'var(--gold)' : 'var(--fg-secondary)',
    background: 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all var(--duration-fast) var(--ease-default)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  });
  const countStyle = active => ({
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    padding: '1px 6px',
    borderRadius: '8px',
    background: active ? 'rgba(197,164,78,0.15)' : 'rgba(255,255,255,0.06)',
    color: active ? 'var(--gold)' : 'var(--fg-tertiary)'
  });
  return React.createElement('div', {
    style: tabBarStyle,
    className
  }, tabs.map(tab => React.createElement('button', {
    key: tab.id,
    style: tabStyle(tab.id === activeId),
    onClick: () => onChange(tab.id)
  }, tab.label, tab.count != null ? React.createElement('span', {
    style: countStyle(tab.id === activeId)
  }, tab.count) : null)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/feedback/LogEntry.jsx
try { (() => {
const levelColors = {
  ERR: 'red',
  WRN: 'orange',
  INF: 'blue',
  DBG: 'muted',
  TRC: 'muted'
};
function LogEntry({
  time,
  level,
  message,
  source,
  className
}) {
  const variant = levelColors[level] || 'muted';
  const rowStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '6px 0',
    borderBottom: '1px solid var(--border-subtle)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px'
  };
  const timeStyle = {
    color: 'var(--fg-tertiary)',
    minWidth: '58px',
    flexShrink: 0
  };
  const badgeStyle = {
    fontSize: '11px',
    fontWeight: 'var(--weight-bold)',
    padding: '1px 6px',
    borderRadius: '3px',
    border: `1px solid`,
    minWidth: '28px',
    textAlign: 'center',
    flexShrink: 0
  };
  const badgeColors = {
    red: {
      color: 'var(--red)',
      borderColor: 'var(--red)'
    },
    orange: {
      color: 'var(--orange)',
      borderColor: 'var(--orange)'
    },
    blue: {
      color: 'var(--blue)',
      borderColor: 'var(--blue)'
    },
    muted: {
      color: 'var(--fg-tertiary)',
      borderColor: 'var(--border-default)'
    }
  };
  const msgStyle = {
    color: 'var(--fg-secondary)',
    lineHeight: 1.5,
    flex: 1
  };
  const srcStyle = {
    color: 'var(--fg-tertiary)',
    fontSize: '11px'
  };
  return React.createElement('div', {
    style: rowStyle,
    className
  }, React.createElement('span', {
    style: timeStyle
  }, time), React.createElement('span', {
    style: {
      ...badgeStyle,
      ...badgeColors[variant]
    }
  }, level), React.createElement('span', {
    style: msgStyle
  }, source ? React.createElement('span', {
    style: srcStyle
  }, source + ' · ') : null, message));
}
Object.assign(__ds_scope, { LogEntry });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/LogEntry.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  options,
  value,
  onChange,
  placeholder,
  size = 'md',
  className
}) {
  const style = {
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'sm' ? '13px' : '15px',
    padding: size === 'sm' ? '6px 28px 6px 10px' : '8px 32px 8px 14px',
    background: 'var(--bg-raised)',
    color: 'var(--fg-primary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ba3b5' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right ${size === 'sm' ? '8px' : '12px'} center`,
    transition: 'border-color var(--duration-fast) var(--ease-default)',
    outline: 'none'
  };
  return React.createElement('select', {
    style,
    className,
    value,
    onChange: e => onChange(e.target.value)
  }, placeholder ? React.createElement('option', {
    value: '',
    disabled: true
  }, placeholder) : null, options.map(opt => React.createElement('option', {
    key: opt.value,
    value: opt.value
  }, opt.label)));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/game/PlayerBadge.jsx
try { (() => {
const teamColors = {
  gold: 'var(--gold)',
  blue: 'var(--blue)',
  red: 'var(--red)',
  green: 'var(--green-bright)',
  pink: 'var(--pink)'
};
function PlayerBadge({
  name,
  teamColor = 'blue',
  score,
  isUser,
  className
}) {
  const tc = teamColors[teamColor] || teamColors.blue;
  const wrapStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)'
  };
  const avatarStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--bg-overlay)',
    border: `2px solid ${tc}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: tc,
    fontWeight: 'var(--weight-bold)'
  };
  const nameStyle = {
    fontSize: '14px',
    fontWeight: 'var(--weight-medium)',
    color: 'var(--fg-primary)',
    padding: '4px 12px',
    background: isUser ? 'var(--bg-overlay)' : 'var(--bg-raised)',
    borderRadius: 'var(--radius-full)',
    border: isUser ? `1px solid ${tc}` : '1px solid var(--border-subtle)'
  };
  const scoreStyle = {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--weight-bold)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(0,0,0,0.4)',
    color: tc,
    border: `1px solid ${tc}`
  };
  return React.createElement('div', {
    style: wrapStyle,
    className
  }, React.createElement('div', {
    style: avatarStyle
  }, name.charAt(0).toUpperCase()), React.createElement('span', {
    style: nameStyle
  }, name), score ? React.createElement('span', {
    style: scoreStyle
  }, score) : null);
}
Object.assign(__ds_scope, { PlayerBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/PlayerBadge.jsx", error: String((e && e.message) || e) }); }

// components/game/SpeedControl.jsx
try { (() => {
const DEFAULT_SPEEDS = [0.25, 0.5, 1, 2, 4, 8, 12];
function SpeedControl({
  speeds = DEFAULT_SPEEDS,
  activeSpeed,
  isPlaying,
  onSpeedChange,
  onTogglePlay,
  onStep,
  className
}) {
  const barStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    fontFamily: 'var(--font-sans)'
  };
  const iconBtnStyle = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all var(--duration-fast) var(--ease-default)'
  };
  const playStyle = {
    ...iconBtnStyle,
    background: 'var(--blue)',
    color: 'white'
  };
  const stepStyle = {
    ...iconBtnStyle,
    background: 'transparent',
    color: 'var(--fg-secondary)'
  };
  const labelStyle = {
    fontSize: '12px',
    color: 'var(--fg-tertiary)',
    letterSpacing: 'var(--tracking-caps)',
    textTransform: 'uppercase',
    fontWeight: 'var(--weight-medium)'
  };
  const speedBtnStyle = active => ({
    padding: '4px 10px',
    fontSize: '13px',
    fontWeight: active ? 'var(--weight-bold)' : 'var(--weight-normal)',
    color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
    background: active ? 'var(--gold)' : 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all var(--duration-fast) var(--ease-default)',
    fontFamily: 'var(--font-mono)'
  });
  return React.createElement('div', {
    style: barStyle,
    className
  }, React.createElement('button', {
    style: playStyle,
    onClick: onTogglePlay
  }, isPlaying ? '‖' : '▶'), onStep ? React.createElement('button', {
    style: stepStyle,
    onClick: onStep
  }, '▶|') : null, React.createElement('span', {
    style: labelStyle
  }, 'VITESSE'), ...speeds.map(s => React.createElement('button', {
    key: s,
    style: speedBtnStyle(s === activeSpeed),
    onClick: () => onSpeedChange(s)
  }, s + '×')));
}
Object.assign(__ds_scope, { SpeedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/SpeedControl.jsx", error: String((e && e.message) || e) }); }

// components/game/SuitSelector.jsx
try { (() => {
const suits = [{
  id: 'spades',
  symbol: '♠',
  color: 'var(--suit-spades)'
}, {
  id: 'hearts',
  symbol: '♥',
  color: 'var(--suit-hearts)'
}, {
  id: 'diamonds',
  symbol: '♦',
  color: 'var(--suit-diamonds)'
}, {
  id: 'clubs',
  symbol: '♣',
  color: 'var(--suit-clubs)'
}];
function SuitSelector({
  selected,
  onSelect,
  disabled,
  className
}) {
  const wrapStyle = {
    display: 'flex',
    gap: '8px'
  };
  return React.createElement('div', {
    style: wrapStyle,
    className
  }, suits.map(s => {
    const isActive = selected === s.id;
    const btnStyle = {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: s.color,
      background: isActive ? 'var(--bg-muted)' : 'var(--bg-raised)',
      border: isActive ? '2px solid var(--gold)' : '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all var(--duration-fast) var(--ease-default)',
      opacity: disabled ? 0.4 : 1
    };
    return React.createElement('button', {
      key: s.id,
      style: btnStyle,
      onClick: () => !disabled && onSelect(s.id)
    }, s.symbol);
  }));
}
Object.assign(__ds_scope, { SuitSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/SuitSelector.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brain_editor/BrainEditor.jsx
try { (() => {
const {
  Button,
  Badge,
  Panel,
  Tabs,
  Select
} = window.CephalosophieDesignSystem_5c2e04;

/* ─── Toolbar ─── */
function Toolbar({
  brainName,
  theme,
  version
}) {
  const barStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 16px',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-subtle)',
    fontSize: 13
  };
  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--red)'
  };
  const inputStyle = {
    background: 'var(--bg-raised)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--fg-primary)',
    padding: '4px 10px',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    width: 160
  };
  const sep = {
    width: 1,
    height: 24,
    background: 'var(--border-subtle)',
    margin: '0 4px'
  };
  return React.createElement('div', {
    style: barStyle
  }, React.createElement('div', {
    style: dotStyle
  }), React.createElement('span', {
    style: {
      fontWeight: 600
    }
  }, 'Éditeur de cerveau'), React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)',
      fontSize: 12
    }
  }, 'NOM'), React.createElement('input', {
    style: inputStyle,
    defaultValue: brainName
  }), React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)',
      fontSize: 12
    }
  }, 'THÈME'), React.createElement(Select, {
    options: [{
      value: 'dark',
      label: 'Noir'
    }],
    value: 'dark',
    onChange: () => {},
    size: 'sm'
  }), React.createElement('div', {
    style: sep
  }), React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)',
      fontSize: 12
    }
  }, 'PROJET'), React.createElement(Select, {
    options: [{
      value: 'c2',
      label: 'Cerveau 2'
    }],
    value: 'c2',
    onChange: () => {},
    size: 'sm'
  }), React.createElement('div', {
    style: sep
  }), React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)',
      fontSize: 12
    }
  }, 'VERSION'), React.createElement(Select, {
    options: [{
      value: 'v1',
      label: 'V-1.0.0'
    }],
    value: 'v1',
    onChange: () => {},
    size: 'sm'
  }), React.createElement('div', {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, React.createElement(Button, {
    variant: 'dark',
    size: 'sm'
  }, '💾 Sauvegarder serveur'), React.createElement(Button, {
    variant: 'dark',
    size: 'sm'
  }, '↻ liste serveur')), React.createElement('div', {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--green-bright)'
    }
  }), React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)',
      fontSize: 12
    }
  }, 'local'));
}

/* ─── Function list sidebar ─── */
function FunctionList({
  functions,
  activeIdx,
  onSelect
}) {
  const sideStyle = {
    width: 220,
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-surface)'
  };
  const headerStyle = {
    padding: '10px 14px',
    fontSize: 12,
    color: 'var(--fg-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-subtle)'
  };
  return React.createElement('div', {
    style: sideStyle
  }, React.createElement('div', {
    style: headerStyle
  }, 'FONCTIONS', React.createElement(Button, {
    variant: 'outline',
    size: 'sm'
  }, '+ ajouter')), React.createElement('div', {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, functions.map((fn, i) => React.createElement('div', {
    key: fn.name,
    onClick: () => onSelect(i),
    style: {
      padding: '8px 14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: i === activeIdx ? 'var(--bg-raised)' : 'transparent',
      borderLeft: i === activeIdx ? '3px solid var(--green-bright)' : '3px solid transparent'
    }
  }, React.createElement('span', {
    style: {
      fontSize: 14,
      fontWeight: i === activeIdx ? 600 : 400,
      color: 'var(--fg-primary)'
    }
  }, fn.name), React.createElement('span', {
    style: {
      fontSize: 11,
      color: fn.typeColor || 'var(--fg-tertiary)',
      marginLeft: 'auto'
    }
  }, fn.returnType), React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)',
      fontSize: 12
    }
  }, '▸')))));
}

/* ─── Code editor ─── */
function CodeEditor({
  fnName
}) {
  const editorStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };
  const sigStyle = {
    padding: '10px 16px',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    color: 'var(--fg-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    gap: 12
  };
  const codeStyle = {
    flex: 1,
    padding: 16,
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    color: 'var(--fg-primary)',
    background: 'var(--bg-void)',
    lineHeight: 1.6
  };
  const kw = {
    color: 'var(--purple-bright)'
  };
  const fn = {
    color: 'var(--gold-bright)'
  };
  const str = {
    color: 'var(--green-pale)'
  };
  const cm = {
    color: 'var(--fg-tertiary)'
  };
  const num = {
    color: 'var(--orange-bright)'
  };
  return React.createElement('div', {
    style: editorStyle
  }, React.createElement('div', {
    style: sigStyle
  }, React.createElement('span', {
    style: {
      color: 'var(--red)',
      fontSize: 10
    }
  }, '●'), React.createElement('span', null, fnName, React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)'
    }
  }, '(ctx) {')), React.createElement('div', {
    style: {
      marginLeft: 'auto'
    }
  }, React.createElement(Button, {
    variant: 'gold',
    size: 'sm'
  }, '▶ Tester'))), React.createElement('div', {
    style: codeStyle
  }, React.createElement('div', null, React.createElement('span', {
    style: cm
  }, '// Analyse de l\'ouverture')), React.createElement('div', null, React.createElement('span', {
    style: kw
  }, 'const '), 'trumps = ctx.hand.', React.createElement('span', {
    style: fn
  }, 'filter'), '(c => c.suit === ctx.table.trump);'), React.createElement('div', null, React.createElement('span', {
    style: kw
  }, 'const '), 'hasJack = trumps.', React.createElement('span', {
    style: fn
  }, 'some'), '(c => c.rank === ', React.createElement('span', {
    style: str
  }, '"J"'), ');'), React.createElement('div', null, React.createElement('span', {
    style: kw
  }, 'const '), 'hasNine = trumps.', React.createElement('span', {
    style: fn
  }, 'some'), '(c => c.rank === ', React.createElement('span', {
    style: str
  }, '"9"'), ');'), React.createElement('div', {
    style: {
      marginTop: 8
    }
  }, React.createElement('span', {
    style: kw
  }, 'if '), '(trumps.length >= ', React.createElement('span', {
    style: num
  }, '4'), ' && hasJack) {'), React.createElement('div', {
    style: {
      paddingLeft: 20
    }
  }, React.createElement('span', {
    style: kw
  }, 'return '), '{ action: ', React.createElement('span', {
    style: str
  }, '"bid"'), ', value: ', React.createElement('span', {
    style: num
  }, '90'), ', suit: ctx.table.trump };'), React.createElement('div', null, '}'), React.createElement('div', {
    style: {
      marginTop: 8
    }
  }, React.createElement('span', {
    style: kw
  }, 'return '), '{ action: ', React.createElement('span', {
    style: str
  }, '"pass"'), ' };')));
}

/* ─── Context panel ─── */
function ContextPanel() {
  const panelStyle = {
    width: 280,
    borderLeft: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13
  };
  const sectionStyle = {
    padding: '8px 14px',
    borderBottom: '1px solid var(--border-subtle)'
  };
  const labelStyle = {
    color: 'var(--green-bright)',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 6
  };
  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '3px 0',
    fontFamily: 'var(--font-mono)',
    fontSize: 12
  };
  const varName = {
    color: 'var(--fg-primary)'
  };
  const varType = {
    color: 'var(--fg-tertiary)'
  };
  const handCards = [{
    r: '8',
    s: '♦'
  }, {
    r: 'A',
    s: '♦'
  }, {
    r: '8',
    s: '♠'
  }, {
    r: 'A',
    s: '♠'
  }, {
    r: 'A',
    s: '♠'
  }, {
    r: 'R',
    s: '♦'
  }];
  const cardStyle = isRed => ({
    width: 36,
    height: 50,
    background: '#f5f0e8',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: isRed ? 'var(--red)' : '#1a1a1a',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
  });
  return React.createElement('div', {
    style: panelStyle
  }, /* Hand display */
  React.createElement('div', {
    style: {
      ...sectionStyle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, React.createElement('span', {
    style: {
      fontWeight: 600,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--fg-tertiary)'
    }
  }, 'MA MAIN (8)'), React.createElement(Button, {
    variant: 'outline',
    size: 'sm'
  }, '🎲 Redistribuer')), React.createElement('div', {
    style: {
      ...sectionStyle,
      display: 'flex',
      gap: 6,
      justifyContent: 'center',
      padding: '12px 14px'
    }
  }, handCards.map((c, i) => {
    const isRed = c.s === '♥' || c.s === '♦';
    return React.createElement('div', {
      key: i,
      style: cardStyle(isRed)
    }, React.createElement('span', null, c.r), React.createElement('span', {
      style: {
        fontSize: 10
      }
    }, c.s));
  })), /* Settings */
  React.createElement('div', {
    style: sectionStyle
  }, React.createElement('div', {
    style: {
      ...labelStyle,
      color: 'var(--fg-tertiary)'
    }
  }, 'RÉGLAGES'), React.createElement('div', {
    style: rowStyle
  }, React.createElement('span', {
    style: varName
  }, 'ATOUT'), React.createElement(Select, {
    options: [{
      value: 'coeur',
      label: '♥ coeur'
    }],
    value: 'coeur',
    onChange: () => {},
    size: 'sm'
  })), React.createElement('div', {
    style: rowStyle
  }, React.createElement('span', {
    style: varName
  }, 'PHASE'), React.createElement(Select, {
    options: [{
      value: 'enchere',
      label: 'enchère'
    }],
    value: 'enchere',
    onChange: () => {},
    size: 'sm'
  }))), /* Context vars */
  React.createElement('div', {
    style: {
      ...sectionStyle,
      flex: 1,
      overflowY: 'auto'
    }
  }, React.createElement('div', {
    style: labelStyle
  }, 'CONTEXTE (clic = insère)'), React.createElement('div', {
    style: {
      ...labelStyle,
      color: 'var(--green-bright)',
      fontSize: 10
    }
  }, 'Identité'), ['ctx.seat → Seat', 'ctx.partnerSeat → Seat', 'ctx.myTeam → \'A\'|\'B\'', 'ctx.isDemandeur → boolean'].map((v, i) => {
    const [name, type] = v.split(' → ');
    return React.createElement('div', {
      key: i,
      style: {
        ...rowStyle,
        borderLeft: '2px solid var(--gold-dim)',
        paddingLeft: 8,
        marginBottom: 2
      }
    }, React.createElement('span', {
      style: varName
    }, name), React.createElement('span', {
      style: varType
    }, type));
  }), React.createElement('div', {
    style: {
      ...labelStyle,
      color: 'var(--purple-bright)',
      fontSize: 10,
      marginTop: 8
    }
  }, 'Personnalité / Génome'), ['ctx.personality.aggressiveness → 0..1', 'ctx.personality.concentration → 0..10', 'ctx.personality.velocity → 0..10'].map((v, i) => {
    const [name, type] = v.split(' → ');
    return React.createElement('div', {
      key: i,
      style: {
        ...rowStyle,
        borderLeft: '2px solid var(--purple)',
        paddingLeft: 8,
        marginBottom: 2
      }
    }, React.createElement('span', {
      style: varName
    }, name), React.createElement('span', {
      style: varType
    }, type));
  })), /* Bottom info */
  React.createElement('div', {
    style: {
      padding: '8px 14px',
      borderTop: '1px solid var(--border-subtle)',
      fontSize: 12,
      color: 'var(--fg-tertiary)',
      fontFamily: 'var(--font-mono)'
    }
  }, '} Décide l\'enchère : passer, annoncer (valeur + couleur), capot, contrer.'));
}

/* ─── Bottom output panel ─── */
function OutputPanel() {
  const [activeTab, setActiveTab] = React.useState('objet');
  const panelStyle = {
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    height: 160
  };
  return React.createElement('div', {
    style: panelStyle
  }, React.createElement('div', {
    style: {
      padding: '4px 16px'
    }
  }, React.createElement(Tabs, {
    tabs: [{
      id: 'logs',
      label: 'Logs',
      count: 1
    }, {
      id: 'info',
      label: 'Info',
      count: 1
    }, {
      id: 'errors',
      label: 'Erreurs'
    }, {
      id: 'objet',
      label: 'Objet',
      count: 1
    }],
    activeId: activeTab,
    onChange: setActiveTab
  })), React.createElement('div', {
    style: {
      flex: 1,
      padding: '8px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--fg-secondary)',
      overflowY: 'auto'
    }
  }, React.createElement('div', null, '{'), React.createElement('div', {
    style: {
      paddingLeft: 16
    }
  }, React.createElement('span', {
    style: {
      color: 'var(--blue-bright)'
    }
  }, '"action"'), ': ', React.createElement('span', {
    style: {
      color: 'var(--green-pale)'
    }
  }, '"capot"'), ','), React.createElement('div', {
    style: {
      paddingLeft: 16
    }
  }, React.createElement('span', {
    style: {
      color: 'var(--blue-bright)'
    }
  }, '"thinkMultiplier"'), ': ', React.createElement('span', {
    style: {
      color: 'var(--orange-bright)'
    }
  }, '1'), ','), React.createElement('div', {
    style: {
      paddingLeft: 16
    }
  }, React.createElement('span', {
    style: {
      color: 'var(--blue-bright)'
    }
  }, '"suit"'), ': ', React.createElement('span', {
    style: {
      color: 'var(--green-pale)'
    }
  }, '"pique"')), React.createElement('div', null, '}')));
}

/* ─── Main app ─── */
function BrainEditorApp() {
  const [activeFn, setActiveFn] = React.useState(0);
  const functions = [{
    name: 'decideBid',
    returnType: 'BidDecision',
    typeColor: 'var(--green-bright)'
  }, {
    name: 'decideCard',
    returnType: 'CardDecision',
    typeColor: 'var(--fg-secondary)'
  }, {
    name: 'shouldContre',
    returnType: 'boolean',
    typeColor: 'var(--fg-secondary)'
  }, {
    name: 'shouldSurcontre',
    returnType: 'boolean',
    typeColor: 'var(--fg-secondary)'
  }];
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }
  }, React.createElement(Toolbar, {
    brainName: 'MonCerveau',
    theme: 'Noir',
    version: 'V-1.0.0'
  }), React.createElement('div', {
    style: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    }
  }, React.createElement(FunctionList, {
    functions,
    activeIdx: activeFn,
    onSelect: setActiveFn
  }), React.createElement('div', {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement(CodeEditor, {
    fnName: functions[activeFn].name
  }), React.createElement(OutputPanel)), React.createElement(ContextPanel)));
}
window.BrainEditorApp = BrainEditorApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brain_editor/BrainEditor.jsx", error: String((e && e.message) || e) }); }

// ui_kits/game_table/GameTable.jsx
try { (() => {
const {
  Button,
  Badge,
  Panel,
  Tabs,
  Select,
  PlayerBadge,
  SuitSelector,
  SpeedControl,
  LogEntry
} = window.CephalosophieDesignSystem_5c2e04;

/* ─── Card component ─── */
const cardFaceStyles = {
  width: 60,
  height: 84,
  background: '#f5f0e8',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  position: 'relative',
  userSelect: 'none'
};
const cardBackStyles = {
  width: 60,
  height: 84,
  background: 'var(--card-back-color)',
  borderRadius: 6,
  border: '2px solid rgba(255,255,255,0.12)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
};
const stripeOverlay = {
  position: 'absolute',
  inset: 3,
  borderRadius: 4,
  background: 'var(--card-back-stripe)',
  border: '1px solid rgba(255,255,255,0.08)'
};
function PlayingCard({
  rank,
  suit,
  faceDown,
  style: extra,
  onClick
}) {
  const isRed = suit === '♥' || suit === '♦';
  if (faceDown) {
    return React.createElement('div', {
      style: {
        ...cardBackStyles,
        ...extra
      }
    }, React.createElement('div', {
      style: stripeOverlay
    }));
  }
  return React.createElement('div', {
    style: {
      ...cardFaceStyles,
      cursor: onClick ? 'pointer' : 'default',
      ...extra
    },
    onClick
  }, React.createElement('span', {
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isRed ? 'var(--red)' : '#1a1a1a',
      lineHeight: 1
    }
  }, rank), React.createElement('span', {
    style: {
      fontSize: 18,
      color: isRed ? 'var(--red)' : '#1a1a1a',
      lineHeight: 1
    }
  }, suit));
}

/* ─── Scoreboard ─── */
function Scoreboard({
  scoreA,
  scoreB
}) {
  const s = {
    background: '#fff',
    borderRadius: 4,
    padding: '4px 8px',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: '#1a1a1a',
    display: 'flex',
    gap: 12
  };
  return React.createElement('div', {
    style: s
  }, React.createElement('div', {
    style: {
      textAlign: 'center'
    }
  }, React.createElement('div', {
    style: {
      fontWeight: 'bold',
      fontSize: 11
    }
  }, 'A'), React.createElement('div', null, scoreA)), React.createElement('div', {
    style: {
      textAlign: 'center'
    }
  }, React.createElement('div', {
    style: {
      fontWeight: 'bold',
      fontSize: 11
    }
  }, 'B'), React.createElement('div', null, scoreB)));
}

/* ─── Bidding dialog ─── */
function BiddingDialog({
  onBid,
  onCapot,
  onPass
}) {
  const values = [90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
  const [suit, setSuit] = React.useState(null);
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 6
  };
  const dlgStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    background: 'var(--bg-overlay)',
    borderRadius: 'var(--radius-lg)',
    padding: 24,
    border: '1px solid var(--border-default)',
    width: 320,
    zIndex: 10,
    backdropFilter: 'blur(12px)'
  };
  return React.createElement('div', {
    style: dlgStyle
  }, React.createElement('h3', {
    style: {
      textAlign: 'center',
      marginBottom: 12,
      fontSize: 16,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--gold-bright)'
    }
  }, 'À vous d\'annoncer'), React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 12
    }
  }, React.createElement(SuitSelector, {
    selected: suit,
    onSelect: setSuit
  })), React.createElement('p', {
    style: {
      textAlign: 'center',
      color: 'var(--fg-tertiary)',
      fontSize: 13,
      marginBottom: 12
    }
  }, 'Choisissez une couleur ou « Répéter » pour annoncer.'), React.createElement('div', {
    style: gridStyle
  }, values.map(v => React.createElement('button', {
    key: v,
    onClick: () => onBid && onBid(v, suit),
    style: {
      padding: '8px 0',
      background: v >= 120 ? 'var(--bg-muted)' : 'var(--bg-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--fg-primary)',
      fontSize: 14,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, v))), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12
    }
  }, React.createElement(Button, {
    variant: 'gold',
    fullWidth: true,
    onClick: onCapot
  }, 'Capot'), React.createElement(Button, {
    variant: 'dark',
    fullWidth: true,
    onClick: onPass
  }, 'Passe')));
}

/* ─── Bid history ─── */
function BidHistory({
  bids
}) {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      bottom: 100,
      left: 16
    }
  }, bids.map((b, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      padding: '4px 12px',
      marginBottom: 4,
      borderLeft: `3px solid ${b.team === 'nous' ? 'var(--blue)' : 'var(--red)'}`,
      background: 'var(--bg-raised)',
      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      fontSize: 13
    }
  }, React.createElement('span', {
    style: {
      color: 'var(--fg-primary)',
      fontWeight: 500
    }
  }, b.name), React.createElement('span', {
    style: {
      color: b.team === 'nous' ? 'var(--blue-bright)' : 'var(--red-bright)'
    }
  }, b.action), React.createElement('span', {
    style: {
      color: 'var(--fg-tertiary)',
      fontSize: 12,
      marginLeft: 'auto'
    }
  }, b.team))));
}

/* ─── Console panel ─── */
function ConsolePanel() {
  const [activeTab, setActiveTab] = React.useState('console');
  const logs = [{
    time: '21:23:22',
    level: 'INF',
    source: '6a42b06e',
    msg: 'Ouverture FAIBLE 90 coeur (5 atouts).'
  }, {
    time: '21:23:26',
    level: 'INF',
    source: '6a42b06e',
    msg: 'Réponse au partenaire (90 coeur). As=1 Valet=false.'
  }, {
    time: '21:23:26',
    level: 'WRN',
    source: '6a42b06e',
    msg: 'Sans Valet d\'atout sur ouverture 90 : je PASSE.'
  }, {
    time: '21:23:27',
    level: 'INF',
    source: '6a42b06e',
    msg: 'Annonce adverse en cours, pas de relance.'
  }, {
    time: '21:23:27',
    level: 'INF',
    source: '6a42b06e',
    msg: 'Cartes jouables : 8♥ 7♥ 9♠ 8♠ V♦ V♥ 10♥ A♥'
  }];
  return React.createElement('div', {
    style: {
      width: 360,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid var(--border-subtle)',
      height: '100%'
    }
  }, React.createElement('div', {
    style: {
      padding: '8px 12px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, React.createElement(Tabs, {
    tabs: [{
      id: 'console',
      label: 'Console',
      count: 137
    }, {
      id: 'annonces',
      label: 'Annonces',
      count: 4
    }, {
      id: 'etat',
      label: 'État'
    }],
    activeId: activeTab,
    onChange: setActiveTab
  })), React.createElement('div', {
    style: {
      padding: '4px 12px',
      fontSize: 13,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--fg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, 'Console moteur', React.createElement('div', {
    style: {
      display: 'flex',
      gap: 4,
      marginLeft: 'auto'
    }
  }, React.createElement(Badge, {
    variant: 'red'
  }, 'ERR'), React.createElement(Badge, {
    variant: 'orange'
  }, 'WRN'), React.createElement(Badge, {
    variant: 'blue'
  }, 'INF'), React.createElement(Badge, {
    variant: 'muted'
  }, 'DBG'))), React.createElement('div', {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 12px'
    }
  }, logs.map((l, i) => React.createElement(LogEntry, {
    key: i,
    time: l.time,
    level: l.level,
    source: l.source,
    message: l.msg
  }))));
}

/* ─── Main app ─── */
function GameTableApp() {
  const [speed, setSpeed] = React.useState(1);
  const [playing, setPlaying] = React.useState(true);
  const [mode, setMode] = React.useState('classic');
  const [showBidding, setShowBidding] = React.useState(true);
  const hand = [{
    r: 'R',
    s: '♥'
  }, {
    r: 'A',
    s: '♠'
  }, {
    r: 'R',
    s: '♠'
  }, {
    r: '10',
    s: '♥'
  }, {
    r: 'R',
    s: '♦'
  }, {
    r: 'D',
    s: '♦'
  }, {
    r: '8',
    s: '♦'
  }];
  const bids = [{
    name: 'Athéna',
    action: '90 ♥',
    team: 'adversaire'
  }, {
    name: 'Borée',
    action: 'passe',
    team: 'nous'
  }, {
    name: 'Calliope',
    action: 'passe',
    team: 'adversaire'
  }];
  const headerStyle = {
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderBottom: '1px solid var(--border-subtle)'
  };
  const tableAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  };
  const feltStyle = {
    flex: 1,
    margin: '16px 20px',
    background: 'var(--gradient-felt)',
    border: 'var(--felt-border-width) solid var(--felt-border-color)',
    borderRadius: 'var(--felt-border-radius)',
    position: 'relative'
  };
  const handStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    padding: '12px 0 16px',
    borderTop: '2px solid var(--gold-dim)'
  };
  return React.createElement('div', {
    style: {
      display: 'flex',
      height: '100vh'
    }
  }, React.createElement('div', {
    style: {
      ...tableAreaStyle
    }
  }, /* Header */
  React.createElement('div', {
    style: headerStyle
  }, React.createElement('h1', {
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-bold)',
      margin: 0
    }
  }, 'Entraînement local'), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 8,
      marginLeft: 16,
      flex: 1
    }
  }, React.createElement(Select, {
    options: [{
      value: 'classic',
      label: 'Jouer avec mes robots (vous = siège A)'
    }],
    value: mode,
    onChange: setMode,
    size: 'sm'
  }), React.createElement(Select, {
    options: [{
      value: '2',
      label: '2 manches'
    }],
    value: '2',
    onChange: () => {},
    size: 'sm'
  }), React.createElement(Select, {
    options: [{
      value: 'ccw',
      label: '↺ Antihoraire'
    }],
    value: 'ccw',
    onChange: () => {},
    size: 'sm'
  }), React.createElement(Badge, {
    variant: 'gold',
    appearance: 'filled',
    size: 'md'
  }, 'En cours…'))), /* Felt table */
  React.createElement('div', {
    style: feltStyle
  }, /* Players at positions */
  React.createElement('div', {
    style: {
      position: 'absolute',
      top: 12,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }, React.createElement(PlayerBadge, {
    name: 'Boré',
    teamColor: 'blue'
  })), React.createElement('div', {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }, React.createElement(PlayerBadge, {
    name: 'Athé',
    teamColor: 'red',
    score: '90 ♥'
  })), React.createElement('div', {
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }, React.createElement(PlayerBadge, {
    name: 'Call',
    teamColor: 'red',
    score: '100 ♥'
  })), /* Scoreboard */
  React.createElement('div', {
    style: {
      position: 'absolute',
      top: 12,
      right: 12
    }
  }, React.createElement(Scoreboard, {
    scoreA: 64,
    scoreB: 67
  })), /* Hidden hands */
  React.createElement('div', {
    style: {
      position: 'absolute',
      top: 50,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: -30
    }
  }, [0, 1, 2, 3, 4, 5, 6, 7].map(i => React.createElement(PlayingCard, {
    key: i,
    faceDown: true,
    style: {
      width: 40,
      height: 56,
      marginLeft: i > 0 ? -18 : 0
    }
  }))), React.createElement('div', {
    style: {
      position: 'absolute',
      left: 50,
      top: '45%',
      display: 'flex',
      flexDirection: 'column',
      gap: -20
    }
  }, [0, 1, 2].map(i => React.createElement(PlayingCard, {
    key: i,
    faceDown: true,
    style: {
      width: 40,
      height: 56,
      marginTop: i > 0 ? -30 : 0
    }
  }))), React.createElement('div', {
    style: {
      position: 'absolute',
      right: 50,
      top: '45%',
      display: 'flex',
      flexDirection: 'column',
      gap: -20
    }
  }, [0, 1, 2].map(i => React.createElement(PlayingCard, {
    key: i,
    faceDown: true,
    style: {
      width: 40,
      height: 56,
      marginTop: i > 0 ? -30 : 0
    }
  }))), /* Center played cards */
  React.createElement('div', {
    style: {
      position: 'absolute',
      top: '45%',
      left: '45%',
      display: 'flex',
      gap: 4
    }
  }, React.createElement(PlayingCard, {
    rank: '7',
    suit: '♥'
  }), React.createElement(PlayingCard, {
    rank: '9',
    suit: '♥'
  })), /* Bidding overlay */
  showBidding ? React.createElement(BiddingDialog, {
    onBid: () => setShowBidding(false),
    onCapot: () => setShowBidding(false),
    onPass: () => setShowBidding(false)
  }) : null), /* Bid history */
  React.createElement(BidHistory, {
    bids
  }), /* Player hand */
  React.createElement('div', {
    style: handStyle
  }, hand.map((c, i) => React.createElement(PlayingCard, {
    key: i,
    rank: c.r,
    suit: c.s
  }))), /* Player label */
  React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: 8
    }
  }, React.createElement(PlayerBadge, {
    name: 'Vous',
    teamColor: 'gold',
    isUser: true
  })), /* Speed controls */
  React.createElement('div', {
    style: {
      padding: '8px 20px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, React.createElement(SpeedControl, {
    activeSpeed: speed,
    isPlaying: playing,
    onSpeedChange: setSpeed,
    onTogglePlay: () => setPlaying(!playing),
    onStep: () => {}
  }))), /* Console panel */
  React.createElement(ConsolePanel));
}
window.GameTableApp = GameTableApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/game_table/GameTable.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.LogEntry = __ds_scope.LogEntry;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.PlayerBadge = __ds_scope.PlayerBadge;

__ds_ns.SpeedControl = __ds_scope.SpeedControl;

__ds_ns.SuitSelector = __ds_scope.SuitSelector;

})();
