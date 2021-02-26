import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as styles from './styles.css';
import { Button } from '../Button';
import { Input } from '../Input';
import * as classnames from 'classnames';
import { Link } from 'react-router-dom';

type ModalSizes = 'small' | 'medium' | 'large' | 'fit';

interface ExtendedHeaderProps {
  text: string;
  link?: {
    title: string;
    href: string;
  };
  onClose?: Function;
  onSearchChanged?: (filterValue: string) => void;
  searchValue?: string;
}

class ExtendedHeader extends React.Component<ExtendedHeaderProps, any> {
  render() {
    let { text = '', link, onClose, onSearchChanged, searchValue } = this.props;

    let searchable = typeof onSearchChanged == 'function';
    let closeButton = typeof onClose == 'function';

    return (
      <div className={styles.ExtendedModalHeader}>
        <div className={styles.ExtendedModalHeaderTitle}>
          <span>{text || ''}</span>
          {!!link && <Link to={link.href}>{link.title}</Link>}
        </div>
        <div className={styles.ExtendedModalHeaderActions}>
          {searchable && (
            <Input
              fluid
              type="text"
              size="small"
              value={searchValue || ''}
              placeholder="Search"
              iconRight="fas fa-search"
              onChange={e => onSearchChanged(e.target.value)}
              className={styles.ExtendedModalHeaderActionsSearch}
            />
          )}
          {closeButton && (
            <Button type="light" onClick={onClose as any} className={styles.FilterHeaderClear}>
              <i className="fas fa-times" />
            </Button>
          )}
        </div>
      </div>
    );
  }
}

interface ModalProps {
  show: boolean;
  children: any;
  header?: any;
  headerText?: any;
  footer?: any;
  showCancel?: boolean;
  showOk?: boolean;
  showSecondaryOk?: boolean;
  onCancel?: Function;
  onOk?: Function;
  isOkDisabled?: boolean;
  onSecondaryOk?: Function;
  cancelText?: string;
  okText?: string;
  secondaryOkText?: string;
  className?: string;
  wrapperClassName?: string;
  size?: ModalSizes;
  footerClass?: string;
  height?: number;
  width?: number;
}

export class Modal extends React.Component<ModalProps, {}> {
  public static ExtendedHeader = ExtendedHeader;

  public static defaultProps: Partial<ModalProps> = {
    showCancel: false,
    showOk: true,
    okText: 'Ok',
    cancelText: 'Cancel',
    size: 'medium'
  };

  onOkClick(e: any) {
    if (this.props.onOk) this.props.onOk();
  }

  onSecondaryClick(e: any) {
    if (this.props.onSecondaryOk) this.props.onSecondaryOk();
  }

  onCancelClick(e: any) {
    if (this.props.onCancel) this.props.onCancel();
  }

  getOkButton = () =>
    this.props.showOk ? (
      <Button
        disabled={this.props.isOkDisabled}
        type="primary"
        size="tiny"
        onClick={this.onOkClick.bind(this)}
        className={styles.OkBtn}
      >
        {this.props.okText}
      </Button>
    ) : null;

  secondaryOkButton = this.props.showSecondaryOk ? (
    <Button
      type="primary"
      size="tiny"
      onClick={this.onSecondaryClick.bind(this)}
      className={styles.OkBtn}
    >
      {this.props.secondaryOkText}
    </Button>
  ) : null;

  cancelButton = this.props.showCancel ? (
    <Button
      type="primary"
      size="tiny"
      outline
      onClick={this.onCancelClick.bind(this)}
      className={styles.CancelBtn}
    >
      {this.props.cancelText}
    </Button>
  ) : null;

  render() {
    if (!this.props.show) {
      return null;
    }

    const okButton = this.getOkButton();

    return (
      <div className={classnames(styles.Modal, this.props.wrapperClassName || '')}>
        <div
          className={classnames(
            styles.ModalInner,
            {
              [styles.ModalMedium]: this.props.size === 'medium',
              [styles.ModalLarge]: this.props.size === 'large',
              [styles.ModalSmall]: this.props.size === 'small',
              [styles.ModalFit]: this.props.size === 'fit'
            },
            this.props.className
          )}
          style={{height: this.props.height && `${this.props.height}%`, width: this.props.width && `${this.props.width}%`}}
        >
          <div
            className={classnames(styles.ModalHeader, {
              [styles.textContent]: !this.props.header && !!this.props.headerText
            })}
          >
            {this.props.header ? this.props.header : this.props.headerText || ''}
          </div>
          {this.props.children}
          <div className={classnames(styles.ModalFooter, this.props.footerClass || '')}>
            {this.props.footer && this.props.footer}
            {this.cancelButton || okButton ? (
              <div className={styles.ModalButtons}>
                {this.cancelButton}
                {this.secondaryOkButton}
                {okButton}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
