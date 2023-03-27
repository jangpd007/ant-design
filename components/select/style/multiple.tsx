import type { CSSInterpolation, CSSObject } from '@ant-design/cssinjs';
import type { SelectToken } from '.';
import { mergeToken } from '../../theme/internal';

const FIXED_ITEM_MARGIN = 2;

const getSelectItemStyle = ({
  controlHeightSM,
  controlHeight,
  lineWidth: borderWidth,
}: SelectToken): readonly [number, number] => {
  const selectItemDist = (controlHeight - controlHeightSM) / 2 - borderWidth;
  const selectItemMargin = Math.ceil(selectItemDist / 2);
  return [selectItemDist, selectItemMargin] as const;
};

function genSizeStyle(token: SelectToken, suffix?: string): CSSObject {
  const { componentCls, antCls } = token;

  const selectOverflowPrefixCls = `${componentCls}-selection-overflow`;

  const selectItemHeight = token.controlHeightSM;
  const [selectItemDist] = getSelectItemStyle(token);

  const suffixCls = suffix ? `${componentCls}-${suffix}` : '';

  return {
    [`${componentCls}-multiple${suffixCls}`]: {
      fontSize: token.fontSize,

      /**
       * Do not merge `height` & `line-height` under style with `selection` & `search`, since chrome
       * may update to redesign with its align logic.
       */
      // =========================== Overflow ===========================
      [selectOverflowPrefixCls]: {
        position: 'relative',
        display: 'flex',
        flex: 'auto',
        flexWrap: 'wrap',
        maxWidth: '100%',
        '&-item': {
          // flex: 'none',
          alignSelf: 'center',
          maxWidth: '100%',
          display: 'inline-flex',
        },
      },

      // ========================= Selector =========================
      [`${componentCls}-selector`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        // Multiple is little different that horizontal is follow the vertical
        padding: `${selectItemDist - FIXED_ITEM_MARGIN}px ${FIXED_ITEM_MARGIN * 2}px`,
        borderRadius: token.borderRadius,

        [`${componentCls}-show-search&`]: {
          cursor: 'text',
        },

        [`${componentCls}-disabled&`]: {
          background: token.colorBgContainerDisabled,
          cursor: 'not-allowed',
        },

        '&:after': {
          display: 'inline-block',
          width: 0,
          margin: `${FIXED_ITEM_MARGIN}px 0`,
          lineHeight: `${selectItemHeight}px`,
          content: '"\\a0"',
        },
      },

      [`
        &${componentCls}-show-arrow ${componentCls}-selector,
        &${componentCls}-allow-clear ${componentCls}-selector
      `]: {
        paddingInlineEnd: token.fontSizeIcon + token.controlPaddingHorizontal,
      },

      // ========================== Input ==========================
      [`${selectOverflowPrefixCls}-item + ${selectOverflowPrefixCls}-item`]: {
        [`${componentCls}-selection-search`]: {
          marginInlineStart: 0,
        },
      },

      [`${componentCls}-selection-search`]: {
        display: 'inline-flex',
        position: 'relative',
        maxWidth: '100%',
        marginInlineStart: token.inputPaddingHorizontalBase - selectItemDist,

        [`
          &-input,
          &-mirror
        `]: {
          height: selectItemHeight,
          fontFamily: token.fontFamily,
          lineHeight: `${selectItemHeight}px`,
          transition: `all ${token.motionDurationSlow}`,
        },

        '&-input': {
          width: '100%',
          minWidth: 4.1, // fix search cursor missing
        },

        '&-mirror': {
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 'auto',
          zIndex: 999,
          whiteSpace: 'pre', // fix whitespace wrapping caused width calculation bug
          visibility: 'hidden',
        },
      },

      // ======================= Placeholder =======================
      [`${componentCls}-selection-placeholder `]: {
        position: 'absolute',
        top: '50%',
        insetInlineStart: token.inputPaddingHorizontalBase,
        insetInlineEnd: token.inputPaddingHorizontalBase,
        transform: 'translateY(-50%)',
        transition: `all ${token.motionDurationSlow}`,
      },
      [`${antCls}-select-tag`]: {
        maxWidth: '100%',
        height: selectItemHeight,
        display: 'flex',
        fontSize: 'inherit',
        alignItems: 'center',
        justifyContent: 'center',
        margin: FIXED_ITEM_MARGIN,
      },
      [`&${componentCls}-lg`]: {
        [`${antCls}-select-tag`]: {
          borderRadius: token.borderRadius,
        },
      },
      [`&${componentCls}-sm`]: {
        [`${antCls}-select-tag`]: {
          borderRadius: token.borderRadiusXS,
        },
      },
    },
  };
}

export default function genMultipleStyle(token: SelectToken): CSSInterpolation {
  const { componentCls } = token;

  const smallToken = mergeToken<SelectToken>(token, {
    controlHeight: token.controlHeightSM,
    controlHeightSM: token.controlHeightXS,
    borderRadius: token.borderRadiusSM,
    borderRadiusSM: token.borderRadiusXS,
  });
  const [, smSelectItemMargin] = getSelectItemStyle(token);

  return [
    genSizeStyle(token),
    // ======================== Small ========================
    // Shared
    genSizeStyle(smallToken, 'sm'),

    // Padding
    {
      [`${componentCls}-multiple${componentCls}-sm`]: {
        [`${componentCls}-selection-placeholder`]: {
          insetInline: token.controlPaddingHorizontalSM - token.lineWidth,
        },

        // https://github.com/ant-design/ant-design/issues/29559
        [`${componentCls}-selection-search`]: {
          marginInlineStart: smSelectItemMargin,
        },
      },
    },

    // ======================== Large ========================
    // Shared
    genSizeStyle(
      mergeToken<any>(token, {
        fontSize: token.fontSizeLG,
        controlHeight: token.controlHeightLG,
        controlHeightSM: token.controlHeight,
        borderRadius: token.borderRadiusLG,
        borderRadiusSM: token.borderRadius,
      }),
      'lg',
    ),
  ];
}
